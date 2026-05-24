import { CAL_EMBED_SCRIPT, CAL_NAMESPACE, CAL_ORIGIN } from './cal';

type CalFn = ((...args: unknown[]) => void) & {
  q?: unknown[][];
  ns?: Record<string, CalFn>;
  loaded?: boolean;
};

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

/** Bootstrap loader from Cal.com element-click embed snippet. */
function bootstrapCalLoader() {
  if (window.Cal) return;

  const C = window;
  const A = CAL_EMBED_SCRIPT;
  const L = 'init';

  const enqueue = (target: CalFn, args: unknown[]) => {
    target.q = target.q || [];
    target.q.push(args);
  };

  C.Cal = function cal(...args: unknown[]) {
    const calApi = C.Cal!;
    if (!calApi.loaded) {
      calApi.ns = {};
      calApi.q = calApi.q || [];
      const script = document.createElement('script');
      script.src = A;
      script.async = true;
      document.head.appendChild(script);
      calApi.loaded = true;
    }

    if (args[0] === L) {
      const api = function apiCall(...callArgs: unknown[]) {
        enqueue(api, callArgs);
      } as CalFn;
      api.q = api.q || [];
      const namespace = args[1];
      if (typeof namespace === 'string') {
        calApi.ns![namespace] = calApi.ns![namespace] || api;
        enqueue(calApi.ns![namespace], args);
        enqueue(calApi, ['initNamespace', namespace]);
      } else {
        enqueue(calApi, args);
      }
      return;
    }

    enqueue(calApi, args);
  } as CalFn;
}

let initPromise: Promise<void> | null = null;

/** Load embed.js and configure the 15min namespace (month_view layout). */
export function initCalEmbed(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve) => {
    bootstrapCalLoader();
    window.Cal!('init', CAL_NAMESPACE, { origin: CAL_ORIGIN });
    window.Cal!.ns![CAL_NAMESPACE]('ui', {
      hideEventTypeDetails: false,
      layout: 'month_view',
    });

    const script = document.querySelector(
      `script[src="${CAL_EMBED_SCRIPT}"]`,
    ) as HTMLScriptElement | null;

    if (!script) {
      resolve();
      return;
    }

    if (script.dataset.calReady === '1') {
      resolve();
      return;
    }

    script.addEventListener(
      'load',
      () => {
        script.dataset.calReady = '1';
        resolve();
      },
      { once: true },
    );
  });

  return initPromise;
}
