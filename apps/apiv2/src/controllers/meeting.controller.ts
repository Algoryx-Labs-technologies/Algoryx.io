import { Request, Response, NextFunction } from 'express';
import {
  MEETING_STATUSES,
  MEETING_TYPES,
  MeetingStatus,
  MeetingType,
} from '@/models/meeting.model';
import {
  createMeeting,
  deleteMeeting,
  listMeetings,
  updateMeeting,
} from '@/services/meeting.service';

export const getMeetings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status = req.query.status as MeetingStatus | undefined;
    const type = req.query.type as MeetingType | undefined;
    const upcoming = req.query.upcoming === 'true';
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const meetings = await listMeetings({ status, type, upcoming, search });

    res.json({
      success: true,
      data: meetings,
    });
  } catch (error) {
    next(error);
  }
};

export const postMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title,
      type,
      status,
      scheduledAt,
      durationMinutes,
      attendeeName,
      attendeeEmail,
      locationOrLink,
      notes,
      projectId,
    } = req.body;

    const meeting = await createMeeting({
      title,
      type,
      status,
      scheduledAt,
      durationMinutes,
      attendeeName,
      attendeeEmail,
      locationOrLink,
      notes,
      projectId,
    });

    res.status(201).json({
      success: true,
      data: meeting,
      message: 'Meeting scheduled successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const patchMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    const meeting = await updateMeeting(id, req.body);

    res.json({
      success: true,
      data: meeting,
      message: 'Meeting updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removeMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    await deleteMeeting(id);

    res.json({
      success: true,
      message: 'Meeting deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMeetingMeta = (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      types: MEETING_TYPES,
      statuses: MEETING_STATUSES,
    },
  });
};
