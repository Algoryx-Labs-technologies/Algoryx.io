import type { LucideIcon } from 'lucide-react';
import {
  Link2,
  Bot,
  LineChart,
  SlidersHorizontal,
  ScanSearch,
  LayoutDashboard,
  BellRing,
  ShieldCheck,
} from 'lucide-react';

export type PrimeCapability = {
  title: string;
  items: string[];
};

export type PrimeProcessStep = {
  step: string;
  duration?: string;
};

export type PrimeService = {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  overview: string;
  problems: string[];
  solutions: string[];
  capabilities: PrimeCapability[];
  deliverables: string[];
  process: PrimeProcessStep[];
  idealFor: string[];
  icon: LucideIcon;
};

export const PRIME_SERVICES: PrimeService[] = [
  {
    id: 'broker-integration',
    title: 'Broker Integration',
    tagline: 'Your strategy, connected to real markets',
    summary:
      'Secure, reliable connections between your trading systems and the brokers you already use—across equities, forex, commodities, and derivatives.',
    overview:
      'Algoryx Prime connects your automation, screeners, dashboards, and alerts to live broker infrastructure. We handle API authentication, order routing, position sync, and error handling so execution stays stable whether you trade NSE, global forex, or commodity futures. You keep your broker relationship; we make your software speak to it correctly.',
    problems: [
      'Fragmented APIs and inconsistent documentation across brokers',
      'Orders failing silently or duplicating under load',
      'No single view of positions when using multiple accounts',
      'Sandbox and live environments that behave differently',
    ],
    solutions: [
      'Production-grade API wrappers with retries and idempotent orders',
      'Unified position and balance sync across accounts',
      'Sandbox-to-live migration with the same codebase',
      'Monitoring, logging, and alerts when connectivity breaks',
    ],
    capabilities: [
      {
        title: 'Multi-market connectivity',
        items: [
          'Indian and international equity, F&O, and commodity brokers',
          'Forex and CFD platforms with REST and WebSocket feeds',
          'Crypto exchange APIs where your strategy requires them',
        ],
      },
      {
        title: 'Order & account operations',
        items: [
          'Market, limit, stop, and bracket-style order support',
          'Real-time fills, cancellations, and modification handling',
          'Account balances, margins, and open position synchronization',
        ],
      },
      {
        title: 'Reliability & security',
        items: [
          'Encrypted credential storage and token refresh flows',
          'Rate limiting and queue management to stay within API limits',
          'Failover patterns and graceful degradation on outages',
        ],
      },
      {
        title: 'Ecosystem fit',
        items: [
          'Plug into automation, screeners, dashboards, and alert pipelines',
          'Paper-trading and live modes sharing one integration layer',
          'Documentation and handover for your team or prop desk',
        ],
      },
    ],
    deliverables: [
      'Integration architecture aligned to your brokers and asset classes',
      'Tested connector module with staging and production configs',
      'Order and position event streams for downstream systems',
      'Runbooks for credentials, deployment, and incident response',
    ],
    process: [
      { step: 'Map brokers, instruments, and order types you need', duration: '1–2 sessions' },
      { step: 'Design auth, routing, and sync architecture', duration: '2–4 days' },
      { step: 'Build and validate in sandbox or paper mode', duration: '1–3 weeks' },
      { step: 'Production rollout with monitoring and support', duration: 'Ongoing' },
    ],
    idealFor: [
      'Traders moving from manual execution to automated systems',
      'Teams running multiple strategies across one or more brokers',
      'Firms that need a single technical layer over disparate broker APIs',
    ],
    icon: Link2,
  },
  {
    id: 'strategy-automation',
    title: 'Strategy Automation',
    tagline: 'Your rules, running without you',
    summary:
      'We turn your proven trading logic into production automation—you own the strategy; we build the engine that executes it.',
    overview:
      'Strategy automation is for traders who already know what works on the chart but are held back by manual clicks, emotion, and limited hours. We document your entries, exits, sizing, and risk rules, then implement them as clean, monitored systems that run around the clock with sub-second execution where your broker allows.',
    problems: [
      'Emotion overrides discipline at the moments that matter most',
      'Slow manual orders miss optimal entries and exits',
      'Setups trigger when you are offline or focused elsewhere',
      'Fatigue leads to skipped trades and inconsistent rule application',
      'Scaling beyond one or two setups is impractical by hand',
    ],
    solutions: [
      'Rule-based execution with no hesitation or second-guessing',
      '24/7 monitoring across time zones and sessions',
      'Fast, repeatable order placement on every valid signal',
      'Several strategies running in parallel with shared risk controls',
    ],
    capabilities: [
      {
        title: 'Rule translation',
        items: [
          'Structured documentation of entries, exits, and filters',
          'Position sizing and risk limits formalized before code',
          'Edge cases and session rules captured up front',
        ],
      },
      {
        title: 'Automated execution',
        items: [
          'Documented codebase with real-time data handling',
          'Automated entries, exits, and scale-in/out logic',
          'Recovery paths when feeds or APIs hiccup',
        ],
      },
      {
        title: 'Platform flexibility',
        items: [
          'Deploy on your preferred stack or broker environment',
          'Broker API integration included in the delivery path',
          'Alerts and dashboards tied to live system health',
        ],
      },
      {
        title: 'Go-live support',
        items: [
          'Paper trading before capital is deployed',
          'Staged production rollout with monitoring',
          'Post-launch tuning and operational support',
        ],
      },
    ],
    deliverables: [
      'Technical specification you approve before development',
      'Production-ready automation with configuration controls',
      'Monitoring, alerts, and execution logs',
      'Handover session and operational documentation',
    ],
    process: [
      { step: 'Document your trading rules and constraints', duration: '2–3 sessions' },
      { step: 'Translate rules into a technical specification', duration: '2–4 days' },
      { step: 'Develop and review the automated system', duration: '1–4 weeks' },
      { step: 'Paper trade on live data', duration: '1–5 days' },
      { step: 'Deploy to production with monitoring', duration: 'Ongoing' },
    ],
    idealFor: [
      'Profitable discretionary traders ready to scale execution',
      'Systematic traders with clear rules but no engineering team',
      'Trading desks standardizing strategies across operators',
    ],
    icon: Bot,
  },
  {
    id: 'strategy-backtesting',
    title: 'Strategy Backtesting',
    tagline: 'Validate before you risk capital',
    summary:
      'Rigorous historical testing of your rules—with realistic costs and slippage—so you know what to expect before going live.',
    overview:
      'Backtesting answers whether your edge is real or wishful thinking. We simulate your exact rules on historical data you provide or we source together, applying spreads, fees, and slippage so results reflect trading reality. You receive clear metrics, equity curves, and risk stats—not a marketing chart.',
    problems: [
      'Strategies trusted on intuition instead of measured performance',
      'Unknown drawdowns and losing streaks until money is lost',
      'Unrealistic profit expectations without cost modeling',
      'Months of live trial-and-error for flaws visible in days of testing',
      'No baseline to improve or compare strategy versions',
    ],
    solutions: [
      'Multi-year performance view across bull, bear, and sideways regimes',
      'Honest modeling of friction that erodes returns in live trading',
      'Full metric suite: win rate, profit factor, Sharpe, max drawdown',
      'Actionable reports to refine rules or walk away early',
    ],
    capabilities: [
      {
        title: 'Historical analysis',
        items: [
          'Long-horizon tests on client-supplied or agreed data sets',
          'Multiple market regimes included in the review',
          'Instrument and session coverage matched to your plan',
        ],
      },
      {
        title: 'Realistic assumptions',
        items: [
          'Slippage, spreads, and brokerage modeled explicitly',
          'Position sizing applied as in live trading',
          'Sensitivity checks when data or costs are uncertain',
        ],
      },
      {
        title: 'Performance reporting',
        items: [
          'Win rate, profit factor, expectancy, and trade distribution',
          'Risk-adjusted measures such as Sharpe and Sortino',
          'Drawdown depth, duration, and recovery statistics',
        ],
      },
      {
        title: 'Risk insight',
        items: [
          'Worst-case and stress-style scenario review',
          'Trade-level history for the recommended configuration',
          'Clear narrative on strengths, weaknesses, and next steps',
        ],
      },
    ],
    deliverables: [
      'Backtest report with equity curve and monthly breakdown',
      'Trade log and summary statistics',
      'Assumptions document (data, costs, sizing)',
      'Recommendations for refinement or deployment',
    ],
    process: [
      { step: 'Capture your entry, exit, and sizing rules', duration: '1–2 sessions' },
      { step: 'Prepare and validate historical data', duration: '1–3 days' },
      { step: 'Run simulation and quality checks', duration: '1–4 weeks' },
      { step: 'Deliver report and review findings together', duration: '1–3 days' },
    ],
    idealFor: [
      'Discretionary traders formalizing rules for the first time',
      'Traders whose live results do not match expectations',
      'Experienced operators validating changes before redeploying',
    ],
    icon: LineChart,
  },
  {
    id: 'strategy-optimization',
    title: 'Strategy Optimization',
    tagline: 'Better parameters, not curve-fitted luck',
    summary:
      'Systematic parameter search with walk-forward and out-of-sample validation—so improvements hold up outside the spreadsheet.',
    overview:
      'Default indicator settings are rarely optimal for your market and timeframe. We search parameter space methodically, then stress-test winners with walk-forward and out-of-sample splits. The goal is robust uplift you can deploy—not a backtest that looks perfect only on past data.',
    problems: [
      'Arbitrary parameters that were never tested for your strategy',
      'Profit left on the table from suboptimal stops or filters',
      'Drawdowns amplified by poorly tuned risk settings',
      'Trial-and-error tuning that wastes weeks',
      'No proof optimized settings will survive forward',
    ],
    solutions: [
      'Ranked parameter sets validated beyond a single in-sample window',
      'Measured lift on metrics you care about—Sharpe, win rate, or drawdown',
      'Robustness scoring across regimes and Monte Carlo-style checks',
      'Implementation guide with exact settings for live use',
    ],
    capabilities: [
      {
        title: 'Parameter search',
        items: [
          'Grid and structured search across your tunable inputs',
          'Walk-forward analysis to reduce overfitting',
          'Out-of-sample confirmation on held-back periods',
        ],
      },
      {
        title: 'Robustness testing',
        items: [
          'Stability analysis when parameters shift slightly',
          'Sensitivity to market regime changes',
          'Comparison of top candidates, not just the single best line',
        ],
      },
      {
        title: 'Targeted improvement',
        items: [
          'Optimize for Sharpe, win rate, drawdown, or combined goals',
          'Separate tuning for stops, targets, and filters',
          'Per-instrument or per-market parameter sets when needed',
        ],
      },
      {
        title: 'Clear handoff',
        items: [
          'Report across all serious candidates with metrics',
          'Recommended set with backtest trade history',
          'Guidance on when to re-optimize',
        ],
      },
    ],
    deliverables: [
      'Baseline vs optimized performance comparison',
      'Search report with top parameter sets and metrics',
      'Recommended configuration and trade history export',
      'Implementation notes for automation or manual use',
    ],
    process: [
      { step: 'Establish baseline on current parameters', duration: '1–2 days' },
      { step: 'Run structured parameter search', duration: '1–4 weeks' },
      { step: 'Analyze results and select robust winners', duration: '2–3 days' },
      { step: 'Deliver report and recommended settings', duration: '1–2 days' },
    ],
    idealFor: [
      'Traders with a working strategy but untested parameters',
      'Operators seeking better risk-adjusted returns',
      'Strategies that need recalibration for current conditions',
      'Multi-asset traders tuning per instrument or session',
    ],
    icon: SlidersHorizontal,
  },
  {
    id: 'custom-screener',
    title: 'Custom Screener',
    tagline: 'Your setups, found automatically',
    summary:
      'Market scanners built around your criteria—hundreds of symbols checked continuously so you stop hunting charts by hand.',
    overview:
      'A custom screener encodes your edge as software: multi-timeframe conditions, volume filters, pattern logic, or proprietary combinations generic tools cannot express. It runs on live data, ranks matches, and pings you the moment a setup appears—via WhatsApp, Telegram, email, or SMS.',
    problems: [
      'Hours lost scrolling watchlists with few real setups',
      'Opportunities missed while focused on a single chart',
      'Off-the-shelf screeners that cannot express your full logic',
      'Late entries after manual discovery',
      'Coverage limited to a handful of symbols',
    ],
    solutions: [
      'Broad scans across stocks, forex, crypto, or commodities',
      'Real-time and after-hours monitoring where data allows',
      'Instant alerts on channels you actually check',
      'Ranked output so you act on the best matches first',
    ],
    capabilities: [
      {
        title: 'Your scanning logic',
        items: [
          'Multi-timeframe and multi-condition rules',
          'Custom indicators, volume filters, and price action rules',
          'Sector, liquidity, or exchange filters as required',
        ],
      },
      {
        title: 'Live operation',
        items: [
          'Continuous scans on streaming or polled market data',
          'Intraday and session-aware scheduling',
          'Support for multiple exchanges and asset classes',
        ],
      },
      {
        title: 'Alert delivery',
        items: [
          'WhatsApp Business, Telegram, email, and SMS options',
          'Messages with context: symbol, timeframe, trigger reason',
          'Priority levels for critical vs informational hits',
        ],
      },
      {
        title: 'Scale',
        items: [
          'Hundreds of symbols per pass with fast turnaround',
          'Configurable watchlists and universes',
          'Export or API hooks for downstream automation',
        ],
      },
    ],
    deliverables: [
      'Documented scan criteria and alert rules',
      'Deployed screener with your notification channels',
      'Validation report from test runs',
      'Short guide to adjust universes and thresholds',
    ],
    process: [
      { step: 'Define criteria, timeframes, and universes', duration: '1–2 sessions' },
      { step: 'Build screener and data connections', duration: '1–2 weeks' },
      { step: 'Test against known setups you provide', duration: '1–3 days' },
      { step: 'Go live with alerts configured', duration: '1–2 days' },
    ],
    idealFor: [
      'Active traders tired of manual chart patrol',
      'Multi-symbol traders across equities, FX, or crypto',
      'Part-time traders who need coverage during market hours',
      'Technical traders with setups generic tools miss',
    ],
    icon: ScanSearch,
  },
  {
    id: 'custom-dashboard',
    title: 'Custom Dashboard',
    tagline: 'One screen for how you actually trade',
    summary:
      'A unified command center for P&L, positions, signals, and risk—wired to your brokers and tools, laid out for your workflow.',
    overview:
      'Serious traders juggle broker terminals, charts, spreadsheets, and alert apps. We build a single dashboard that pulls what you need into one place: live P&L, open risk, strategy signals, and performance analytics—updated in real time and designed around how you make decisions.',
    problems: [
      'Context switching between disconnected platforms',
      'Critical numbers scattered with no single source of truth',
      'Generic UIs that do not match prop, swing, or systematic workflows',
      'Manual spreadsheets rebuilt every week',
      'Slow decisions while hunting for the right tab',
    ],
    solutions: [
      'Live P&L and positions in one view',
      'Feeds from brokers, screeners, and alert systems combined',
      'Layouts and widgets you specify—not a template forced on you',
      'Risk and exposure visible before you add size',
    ],
    capabilities: [
      {
        title: 'Real-time operations',
        items: [
          'Live P&L, open trades, and pending orders',
          'Signal and alert streams from your strategies',
          'Execution and activity log for review',
        ],
      },
      {
        title: 'Integrations',
        items: [
          'Multi-broker and custom API connections',
          'Webhooks and external data sources',
          'Links to automation and screener outputs',
        ],
      },
      {
        title: 'Analytics',
        items: [
          'Equity curves, win rate, and drawdown charts',
          'Custom reports and date-range comparisons',
          'Per-strategy or per-account breakdowns',
        ],
      },
      {
        title: 'Risk monitoring',
        items: [
          'Exposure, correlation, and limit tracking',
          'Drawdown and alert thresholds',
          'Team or multi-trader views for desks and funds',
        ],
      },
    ],
    deliverables: [
      'UX wireframes approved before build',
      'Hosted or self-hosted dashboard per your preference',
      'Integrated data pipelines and refresh logic',
      'Iteration window after launch for refinements',
    ],
    process: [
      { step: 'Workflow discovery and data inventory', duration: '2–3 sessions' },
      { step: 'UX design and prototype review', duration: '1–2 weeks' },
      { step: 'Development and integration', duration: '4–8 weeks' },
      { step: 'Launch and iterative improvements', duration: 'Ongoing' },
    ],
    idealFor: [
      'Active traders managing multiple instruments',
      'Prop firms and teams needing aggregated risk views',
      'Systematic traders monitoring many automated strategies',
      'Portfolio managers across accounts and asset classes',
    ],
    icon: LayoutDashboard,
  },
  {
    id: 'strategy-alerts',
    title: 'Strategy Alerts',
    tagline: 'Never miss your setup again',
    summary:
      '24/7 monitoring of your exact conditions—with instant delivery on Telegram, WhatsApp, email, or webhook for downstream automation.',
    overview:
      'Alerts turn your strategy into always-on surveillance. We code the same logic you would apply on a chart—breakouts, indicator crosses, multi-timeframe alignment—and fire notifications the second conditions align, whether you are at the desk or asleep.',
    problems: [
      'Best setups occurring outside your active hours',
      'Chart fatigue and burnout from constant watching',
      'Simple price alerts that ignore your full rule set',
      'Delayed reaction after manual spotting',
      'Lost opportunity cost on every missed signal',
    ],
    solutions: [
      'Complex AND/OR and nested conditions supported',
      'Multi-timeframe confirmation in one trigger',
      'Sub-second processing with redundant delivery paths',
      'Webhooks to auto-execute or log in other systems',
    ],
    capabilities: [
      {
        title: 'Precise triggers',
        items: [
          'Multi-indicator and custom formula logic',
          'Cross-timeframe and sequential conditions',
          'Branching alerts for different scenario types',
        ],
      },
      {
        title: 'Delivery channels',
        items: [
          'Telegram and WhatsApp for mobile-first traders',
          'Email with detail for review and archive',
          'Webhooks for bots, sheets, or execution layers',
        ],
      },
      {
        title: 'Reliability',
        items: [
          'High-availability monitoring infrastructure',
          'Failover and health checks on alert pipelines',
          'Audit trail of fired signals',
        ],
      },
      {
        title: 'Integration',
        items: [
          'Works alongside automation and screeners',
          'Priority and quiet hours configuration',
          'Context-rich messages: levels, stops, and rationale',
        ],
      },
    ],
    deliverables: [
      'Alert specification signed off before build',
      'Live alert engine on your symbols and timeframes',
      'Connected notification channels',
      'Support for tuning thresholds post-launch',
    ],
    process: [
      { step: 'Document every trigger and message format', duration: '1 session' },
      { step: 'Build and test alert logic', duration: '1–4 weeks' },
      { step: 'Connect preferred channels', duration: '1–2 days' },
      { step: 'Go live with ongoing monitoring', duration: 'Ongoing' },
    ],
    idealFor: [
      'Part-time traders with full-time day jobs',
      'Global market traders across time zones',
      'Swing traders who need entry and exit pings without a screen',
    ],
    icon: BellRing,
  },
  {
    id: 'paper-trading',
    title: 'Paper Trading',
    tagline: 'Prove it on live data, risk nothing',
    summary:
      'Your strategy runs against real-time markets with simulated fills—full metrics and trade logs before a single rupee or dollar is deployed.',
    overview:
      'Backtests show history; paper trading shows whether your system behaves correctly right now—latency, partial logic bugs, and session quirks included. We stand up environments that mirror production execution with simulated capital, so you gain confidence or fix issues without paying tuition to the market.',
    problems: [
      'Going live on automation that was never exercised in real time',
      'Assuming backtests capture live slippage and feed behavior',
      'Bugs that only appear under live data and order flow',
      'No objective proof the strategy works in current conditions',
    ],
    solutions: [
      'Live data feeds with realistic simulated execution',
      'Complete trade history and performance dashboards',
      'Same alert and monitoring stack as production',
      'Flexible duration until you are satisfied',
    ],
    capabilities: [
      {
        title: 'Live market connection',
        items: [
          'Real-time prices and session behavior',
          'Order book or tick data where required',
          'Same symbol universe as intended live deployment',
        ],
      },
      {
        title: 'Realistic simulation',
        items: [
          'Slippage and latency modeling on fills',
          'Partial fills and rejection handling',
          'P&L and risk metrics matching live reporting',
        ],
      },
      {
        title: 'Visibility',
        items: [
          'Trade-by-trade log with timestamps',
          'Win rate, drawdown, and equity tracking',
          'Daily summaries and threshold alerts',
        ],
      },
      {
        title: 'Path to production',
        items: [
          'Shared codebase between paper and live modes',
          'Checklist for promotion when metrics meet your bar',
          'Optional extended runs for seasonal validation',
        ],
      },
    ],
    deliverables: [
      'Paper environment configured like production',
      'Performance report over the agreed test window',
      'Issue log and fixes before go-live',
      'Go-live recommendation and deployment plan',
    ],
    process: [
      { step: 'Align rules and technical spec with automation build', duration: '2–3 sessions' },
      { step: 'Deploy system in paper mode', duration: '1–4 weeks' },
      { step: 'Run and review metrics together', duration: '1–5 days minimum' },
      { step: 'Promote to live with monitoring when ready', duration: 'Ongoing' },
    ],
    idealFor: [
      'First-time deployers of automated strategies',
      'Traders updating logic who need a safe rehearsal',
      'Anyone who treats capital preservation as non-negotiable',
    ],
    icon: ShieldCheck,
  },
];

export function getPrimeServiceById(id: string): PrimeService | undefined {
  return PRIME_SERVICES.find((s) => s.id === id);
}
