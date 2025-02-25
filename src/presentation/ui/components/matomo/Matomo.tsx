'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { init, push } from '@socialgouv/matomo-next';

import { useConsent } from '@/presentation/ui/components/consentManagement';

export type MatomoProps = {
  env?: string;
  siteId: string;
  url: string;
  nonce?: string;
};

/**
 * Handle Matomo init and consent.
 *
 * Uses `useSearchParams()` internally, must be Suspense-d in server component.
 */
export const Matomo = ({ env, siteId, url, nonce }: MatomoProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { finalityConsent } = useConsent();
  const matomoConsent = finalityConsent?.matomo;
  const [initialized, setInitialized] = useState(false);
  const [previousPath, setPreviousPath] = useState('');

  useEffect(() => {
    if (env === 'development') {
      return;
    }

    if (!initialized) {
      init({
        siteId,
        url,
        nonce,
        onInitialization: () => {
          // Don't track by default.
          push(['optUserOut']);
          // User has to give consent to be tracked.
          push(['requireCookieConsent']);

          // Time on page tracking enabled.
          push(['enableHeartBeatTimer']);
          push(['disableQueueRequest']);
          push(['disablePerformanceTracking']);
        }
      });
      setInitialized(true);
    }
  }, [env, siteId, url, initialized, nonce]);

  useEffect(() => {
    if (!initialized || env === 'development') {
      return;
    }

    if (matomoConsent) {
      console.debug('Activation des cookies Matomo.');
      push(['forgetUserOptOut']);
      push(['rememberCookieConsentGiven']);
    } else {
      console.debug('Désactivation des cookies Matomo.');
      push(['optUserOut']);
      push(['forgetCookieConsentGiven']);
    }
  }, [env, initialized, matomoConsent]);

  /* The @socialgouv/matomo-next does not work with next 13, so we need to handle by ourselves */
  useEffect(() => {
    // console.log(
    //   "dans Matomo useEffect 2",
    //   JSON.stringify(
    //     {
    //       env,
    //       matomoConsent,
    //       pathname,
    //       previousPath,
    //       searchParams: searchParams.toString(),
    //     },
    //     null,
    //     2,
    //   ),
    // );

    if (!initialized || !matomoConsent || !pathname || env === 'dev') {
      return;
    }

    if (!previousPath) {
      return setPreviousPath(pathname);
    }

    push(['setReferrerUrl', `${previousPath}`]);
    setPreviousPath(pathname);

    // In order to ensure that the page title had been updated,
    // we delayed pushing the tracking to the next tick.
    setTimeout(() => {
      if (pathname.startsWith('/recherche')) {
        push(['trackSiteSearch', searchParams?.get('keyword') ?? searchParams?.get('query') ?? '']);
      } else {
        push(['trackPageView']);
      }
    });
  }, [env, initialized, matomoConsent, pathname, previousPath, searchParams]);

  return <></>;
};
