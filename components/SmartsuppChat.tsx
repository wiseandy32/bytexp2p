"use client";

import Script from "next/script";

declare global {
  interface Window {
    smartsupp?: (...args: unknown[]) => void;
    _smartsupp?: {
      key?: string;
      [key: string]: unknown;
    };
  }
}

export default function SmartsuppChat() {
  return (
    <>
      <Script
        id="smartsupp-key"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = 'ceb7023a205d0cc686b614e39fd8199db6aed0d6';
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            })(document);
          `,
        }}
      />
      <noscript>
        Powered by{" "}
        <a href="https://www.smartsupp.com" target="_blank" rel="noreferrer">
          Smartsupp
        </a>
      </noscript>
    </>
  );
}
