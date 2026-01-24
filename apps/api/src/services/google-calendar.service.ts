/**
 * Google Calendar Sync Service
 * 
 * This service handles syncing meetings with Google Calendar.
 * 
 * Setup Instructions:
 * 1. Go to Google Cloud Console (https://console.cloud.google.com/)
 * 2. Create a new project or select existing one
 * 3. Enable Google Calendar API
 * 4. Create OAuth 2.0 credentials
 * 5. Add credentials to your .env file:
 *    - GOOGLE_CLIENT_ID=your_client_id
 *    - GOOGLE_CLIENT_SECRET=your_client_secret
 *    - GOOGLE_REDIRECT_URI=http://localhost:4000/api/v1/auth/google/callback
 * 
 * For production, use environment variables for all credentials.
 */

import { google } from 'googleapis';
import { Meeting } from '@prisma/client';
import { AppError } from '@/types';

export class GoogleCalendarService {
  private oauth2Client: any;

  constructor() {
    // Initialize OAuth2 client with credentials from environment
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/api/v1/auth/google/callback';

    if (!clientId || !clientSecret) {
      console.warn('Google Calendar credentials not configured. Sync functionality will be disabled.');
      return;
    }

    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );
  }

  /**
   * Get authorization URL for Google Calendar OAuth
   */
  getAuthUrl(): string {
    if (!this.oauth2Client) {
      throw new AppError(500, 'Google Calendar not configured');
    }

    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Force consent screen to get refresh token
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    if (!this.oauth2Client) {
      throw new AppError(500, 'Google Calendar not configured');
    }

    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      
      if (!tokens.access_token) {
        throw new AppError(400, 'Failed to get access token');
      }

      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || '',
      };
    } catch (error) {
      console.error('Error getting Google tokens:', error);
      throw new AppError(400, 'Failed to authenticate with Google Calendar');
    }
  }

  /**
   * Set access token for API calls
   */
  setCredentials(accessToken: string, refreshToken?: string) {
    if (!this.oauth2Client) {
      throw new AppError(500, 'Google Calendar not configured');
    }

    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  /**
   * Create a Google Calendar event from a meeting
   * Returns both the event ID and the Google Meet link (if video meeting)
   */
  async createEvent(meeting: Meeting, generateMeetLink: boolean = false): Promise<{ eventId: string; meetLink?: string }> {
    if (!this.oauth2Client) {
      throw new AppError(500, 'Google Calendar not configured');
    }

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    // Combine date and time
    const startDateTime = new Date(`${meeting.date.toISOString().split('T')[0]}T${meeting.startTime}`);
    const endDateTime = new Date(`${meeting.date.toISOString().split('T')[0]}T${meeting.endTime}`);

    // For video meetings, always generate Google Meet link if not provided or if explicitly requested
    const shouldGenerateMeet = meeting.type === 'video' && (generateMeetLink || !meeting.meetingLink);

    const event: any = {
      summary: meeting.title,
      description: meeting.description || '',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      location: meeting.location || undefined,
      attendees: meeting.participants?.map(p => ({ email: p.email, displayName: p.name })) || [],
    };

    // Add conference data to generate Google Meet link
    if (shouldGenerateMeet) {
      event.conferenceData = {
        createRequest: {
          requestId: meeting.id || `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
    }

    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: shouldGenerateMeet ? 1 : 0,
      });

      const eventId = response.data.id || '';
      let meetLink: string | undefined;

      // Extract Google Meet link from the response
      if (shouldGenerateMeet && response.data.conferenceData?.entryPoints) {
        const meetEntryPoint = response.data.conferenceData.entryPoints.find(
          (ep: any) => ep.entryPointType === 'video'
        );
        if (meetEntryPoint?.uri) {
          meetLink = meetEntryPoint.uri;
        }
      }

      return { eventId, meetLink };
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw new AppError(500, 'Failed to create Google Calendar event');
    }
  }

  /**
   * Update a Google Calendar event
   * Returns the updated Google Meet link if it's a video meeting
   */
  async updateEvent(meeting: Meeting, googleEventId: string): Promise<{ meetLink?: string }> {
    if (!this.oauth2Client) {
      throw new AppError(500, 'Google Calendar not configured');
    }

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const startDateTime = new Date(`${meeting.date.toISOString().split('T')[0]}T${meeting.startTime}`);
    const endDateTime = new Date(`${meeting.date.toISOString().split('T')[0]}T${meeting.endTime}`);

    const event: any = {
      summary: meeting.title,
      description: meeting.description || '',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      location: meeting.location || undefined,
    };

    // If it's a video meeting without a link, try to generate one
    if (meeting.type === 'video' && !meeting.meetingLink) {
      event.conferenceData = {
        createRequest: {
          requestId: meeting.id || `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
    }

    try {
      const response = await calendar.events.update({
        calendarId: 'primary',
        eventId: googleEventId,
        requestBody: event,
        conferenceDataVersion: meeting.type === 'video' ? 1 : 0,
      });

      let meetLink: string | undefined;
      if (meeting.type === 'video' && response.data.conferenceData?.entryPoints) {
        const meetEntryPoint = response.data.conferenceData.entryPoints.find(
          (ep: any) => ep.entryPointType === 'video'
        );
        if (meetEntryPoint?.uri) {
          meetLink = meetEntryPoint.uri;
        }
      }

      return { meetLink };
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      throw new AppError(500, 'Failed to update Google Calendar event');
    }
  }

  /**
   * Delete a Google Calendar event
   */
  async deleteEvent(googleEventId: string): Promise<void> {
    if (!this.oauth2Client) {
      throw new AppError(500, 'Google Calendar not configured');
    }

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    try {
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: googleEventId,
      });
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      throw new AppError(500, 'Failed to delete Google Calendar event');
    }
  }

  /**
   * Check if Google Calendar is configured
   */
  isConfigured(): boolean {
    return !!this.oauth2Client && !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
  }
}

export const googleCalendarService = new GoogleCalendarService();

