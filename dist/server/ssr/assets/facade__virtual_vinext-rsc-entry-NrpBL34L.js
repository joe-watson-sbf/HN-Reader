import { jsx, jsxs } from "react/jsx-runtime";
import React__default, { useTransition, useOptimistic, useEffect, createElement, forwardRef, useState, useRef, useCallback, createContext } from "react";
import { u as usePathname, a as useRouter, g as getLayoutSegmentContext, t as toRscUrl, b as getPrefetchedUrls, s as storePrefetchResponse } from "../index.js";
import "../__vite_rsc_assets_manifest.js";
import "react-dom";
import "react-dom/server.edge";
import "node:async_hooks";
function BookmarkButton({
  id,
  title,
  url,
  initialBookmarked
}) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(initialBookmarked);
  const handleToggle = () => {
    startTransition(async () => {
      setOptimistic(!optimistic);
      await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, url })
      });
    });
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: handleToggle,
      disabled: isPending,
      "aria-label": optimistic ? "Remove bookmark" : "Bookmark this story",
      className: `shrink-0 p-1.5 rounded-lg transition-all ${optimistic ? "text-orange-400 bg-orange-500/10 hover:bg-orange-500/20" : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800"}`,
      children: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "w-4 h-4",
          fill: optimistic ? "currentColor" : "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          strokeWidth: 2,
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            }
          )
        }
      )
    }
  );
}
const TABS = [
  { value: "top", label: "Top" },
  { value: "new", label: "New" },
  { value: "ask", label: "Ask" }
];
function SearchBar({
  currentTab,
  currentQuery
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const navigate = (tab, q) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (tab && tab !== "top") params.set("tab", tab);
      if (q) params.set("q", q);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    navigate(currentTab, q);
  };
  return /* @__PURE__ */ jsxs("div", { className: `mb-6 transition-opacity ${isPending ? "opacity-60" : ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      TABS.map(({ value, label }) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate(value, currentQuery),
          className: `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${currentTab === value ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"}`,
          children: label
        },
        value
      )),
      isPending && /* @__PURE__ */ jsx("span", { className: "text-xs text-zinc-500 ml-2 animate-pulse", children: "Loading…" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          name: "q",
          type: "search",
          placeholder: "Filter stories…",
          defaultValue: currentQuery,
          className: "w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors",
          children: /* @__PURE__ */ jsx(
            "svg",
            {
              className: "w-4 h-4",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              strokeWidth: 2,
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                }
              )
            }
          )
        }
      )
    ] })
  ] });
}
function Error({
  error,
  reset
}) {
  useEffect(() => {
    console.error("[HN Reader error]", error);
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md px-4", children: [
    /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: "⚠️" }),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-white mb-2", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "text-zinc-400 text-sm mb-6", children: error.message || "Failed to load stories from the Hacker News API." }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: reset,
        className: "px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg text-sm font-medium transition-colors",
        children: "Try again"
      }
    )
  ] }) });
}
class ErrorBoundary extends React__default.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    if (error && typeof error === "object" && "digest" in error) {
      const digest = String(error.digest);
      if (digest === "NEXT_NOT_FOUND" || // legacy compat
      digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;") || digest.startsWith("NEXT_REDIRECT;")) {
        throw error;
      }
    }
    return { error };
  }
  reset = () => {
    this.setState({ error: null });
  };
  render() {
    if (this.state.error) {
      const FallbackComponent = this.props.fallback;
      return jsx(FallbackComponent, { error: this.state.error, reset: this.reset });
    }
    return this.props.children;
  }
}
class NotFoundBoundaryInner extends React__default.Component {
  constructor(props) {
    super(props);
    this.state = { notFound: false, previousPathname: props.pathname };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.pathname !== state.previousPathname && state.notFound) {
      return { notFound: false, previousPathname: props.pathname };
    }
    return { notFound: state.notFound, previousPathname: props.pathname };
  }
  static getDerivedStateFromError(error) {
    if (error && typeof error === "object" && "digest" in error) {
      const digest = String(error.digest);
      if (digest === "NEXT_NOT_FOUND" || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;404")) {
        return { notFound: true };
      }
    }
    throw error;
  }
  render() {
    if (this.state.notFound) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
function NotFoundBoundary({ fallback, children }) {
  const pathname = usePathname();
  return jsx(NotFoundBoundaryInner, { pathname, fallback, children });
}
function LayoutSegmentProvider({ depth, children }) {
  const ctx = getLayoutSegmentContext();
  if (!ctx) {
    return children;
  }
  return createElement(ctx.Provider, { value: depth }, children);
}
const DANGEROUS_SCHEME_RE = /^[\s\u200B\uFEFF]*(javascript|data|vbscript)\s*:/i;
function isDangerousScheme(url) {
  return DANGEROUS_SCHEME_RE.test(url);
}
const LinkStatusContext = createContext({ pending: false });
function resolveHref(href) {
  if (typeof href === "string")
    return href;
  let url = href.pathname ?? "/";
  if (href.query) {
    const params = new URLSearchParams(href.query);
    url += `?${params.toString()}`;
  }
  return url;
}
function withBasePath(path) {
  {
    return path;
  }
}
function isHashOnlyChange(href) {
  if (href.startsWith("#"))
    return true;
  try {
    const current = new URL(window.location.href);
    const next = new URL(href, window.location.href);
    return current.pathname === next.pathname && current.search === next.search && next.hash !== "";
  } catch {
    return false;
  }
}
function resolveRelativeHref(href) {
  if (typeof window === "undefined")
    return href;
  if (href.startsWith("/") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) {
    return href;
  }
  try {
    const resolved = new URL(href, window.location.href);
    return resolved.pathname + resolved.search + resolved.hash;
  } catch {
    return href;
  }
}
function scrollToHash(hash) {
  if (!hash || hash === "#") {
    window.scrollTo(0, 0);
    return;
  }
  const id = hash.slice(1);
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "auto" });
  }
}
function prefetchUrl(href) {
  if (typeof window === "undefined")
    return;
  const fullHref = withBasePath(href);
  if (fullHref.startsWith("http://") || fullHref.startsWith("https://") || fullHref.startsWith("//"))
    return;
  const rscUrl = toRscUrl(fullHref);
  const prefetched = getPrefetchedUrls();
  if (prefetched.has(rscUrl))
    return;
  prefetched.add(rscUrl);
  const schedule = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 100));
  schedule(() => {
    const win = window;
    if (typeof win.__VINEXT_RSC_NAVIGATE__ === "function") {
      fetch(rscUrl, {
        headers: { Accept: "text/x-component" },
        credentials: "include",
        priority: "low",
        // @ts-expect-error — purpose is a valid fetch option in some browsers
        purpose: "prefetch"
      }).then((response) => {
        if (response.ok) {
          storePrefetchResponse(rscUrl, response);
        } else {
          prefetched.delete(rscUrl);
        }
      }).catch(() => {
        prefetched.delete(rscUrl);
      });
    } else if (win.__NEXT_DATA__?.__vinext?.pageModuleUrl) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = fullHref;
      link.as = "document";
      document.head.appendChild(link);
    }
  });
}
let sharedObserver = null;
const observerCallbacks = /* @__PURE__ */ new WeakMap();
function getSharedObserver() {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined")
    return null;
  if (sharedObserver)
    return sharedObserver;
  sharedObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const callback = observerCallbacks.get(entry.target);
        if (callback) {
          callback();
          sharedObserver?.unobserve(entry.target);
          observerCallbacks.delete(entry.target);
        }
      }
    }
  }, {
    // Start prefetching when the link is within 250px of the viewport.
    // This gives the browser a head start before the user scrolls to it.
    rootMargin: "250px"
  });
  return sharedObserver;
}
function getDefaultLocale() {
  if (typeof window !== "undefined") {
    return window.__VINEXT_DEFAULT_LOCALE__;
  }
  return globalThis.__VINEXT_DEFAULT_LOCALE__;
}
function applyLocaleToHref(href, locale) {
  if (locale === false) {
    return href;
  }
  if (locale === void 0) {
    return href;
  }
  const defaultLocale = getDefaultLocale();
  if (locale === defaultLocale) {
    return href;
  }
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) {
    return href;
  }
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}
const Link = forwardRef(function Link2({ href, as, replace = false, prefetch: prefetchProp, scroll = true, children, onClick, onNavigate, ...rest }, forwardedRef) {
  const { locale, ...restWithoutLocale } = rest;
  const resolvedHref = as ?? resolveHref(href);
  if (typeof resolvedHref === "string" && isDangerousScheme(resolvedHref)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`<Link> blocked dangerous href: ${resolvedHref}`);
    }
    const { passHref: _p2, ...safeProps } = restWithoutLocale;
    return jsx("a", { ...safeProps, children });
  }
  const localizedHref = applyLocaleToHref(resolvedHref, locale);
  const fullHref = withBasePath(localizedHref);
  const [pending, setPending] = useState(false);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const internalRef = useRef(null);
  const shouldPrefetch = prefetchProp !== false;
  const setRefs = useCallback((node) => {
    internalRef.current = node;
    if (typeof forwardedRef === "function")
      forwardedRef(node);
    else if (forwardedRef)
      forwardedRef.current = node;
  }, [forwardedRef]);
  useEffect(() => {
    if (!shouldPrefetch || typeof window === "undefined")
      return;
    const node = internalRef.current;
    if (!node)
      return;
    if (localizedHref.startsWith("http://") || localizedHref.startsWith("https://") || localizedHref.startsWith("//"))
      return;
    const observer = getSharedObserver();
    if (!observer)
      return;
    observerCallbacks.set(node, () => prefetchUrl(localizedHref));
    observer.observe(node);
    return () => {
      observer.unobserve(node);
      observerCallbacks.delete(node);
    };
  }, [shouldPrefetch, localizedHref]);
  const handleClick = async (e) => {
    if (onClick)
      onClick(e);
    if (e.defaultPrevented)
      return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    if (e.currentTarget.target && e.currentTarget.target !== "_self") {
      return;
    }
    if (resolvedHref.startsWith("http://") || resolvedHref.startsWith("https://") || resolvedHref.startsWith("//")) {
      return;
    }
    e.preventDefault();
    if (onNavigate) {
      try {
        const navUrl = new URL(resolvedHref, window.location.origin);
        let prevented = false;
        const navEvent = {
          url: navUrl,
          preventDefault() {
            prevented = true;
          },
          get defaultPrevented() {
            return prevented;
          }
        };
        onNavigate(navEvent);
        if (navEvent.defaultPrevented) {
          return;
        }
      } catch {
      }
    }
    if (!replace) {
      const state = window.history.state ?? {};
      window.history.replaceState({ ...state, __vinext_scrollX: window.scrollX, __vinext_scrollY: window.scrollY }, "");
    }
    const absoluteHref = resolveRelativeHref(resolvedHref);
    const absoluteFullHref = withBasePath(absoluteHref);
    if (typeof window !== "undefined" && isHashOnlyChange(absoluteFullHref)) {
      const hash2 = absoluteFullHref.includes("#") ? absoluteFullHref.slice(absoluteFullHref.indexOf("#")) : "";
      if (replace) {
        window.history.replaceState(null, "", absoluteFullHref);
      } else {
        window.history.pushState(null, "", absoluteFullHref);
      }
      if (scroll) {
        scrollToHash(hash2);
      }
      return;
    }
    const hashIdx = absoluteFullHref.indexOf("#");
    const hash = hashIdx !== -1 ? absoluteFullHref.slice(hashIdx) : "";
    const win = window;
    if (typeof win.__VINEXT_RSC_NAVIGATE__ === "function") {
      if (replace) {
        window.history.replaceState(null, "", absoluteFullHref);
      } else {
        window.history.pushState(null, "", absoluteFullHref);
      }
      setPending(true);
      try {
        await win.__VINEXT_RSC_NAVIGATE__(absoluteFullHref);
      } finally {
        if (mountedRef.current)
          setPending(false);
      }
    } else {
      try {
        const routerModule = await import("./router-Byo2jdDs.js");
        const Router = routerModule.default;
        if (replace) {
          await Router.replace(absoluteHref, void 0, { scroll });
        } else {
          await Router.push(absoluteHref, void 0, { scroll });
        }
      } catch {
        if (replace) {
          window.history.replaceState({}, "", absoluteFullHref);
        } else {
          window.history.pushState({}, "", absoluteFullHref);
        }
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    }
    if (scroll) {
      if (hash) {
        scrollToHash(hash);
      } else {
        window.scrollTo(0, 0);
      }
    }
  };
  const { passHref: _p, ...anchorProps } = restWithoutLocale;
  const linkStatusValue = React__default.useMemo(() => ({ pending }), [pending]);
  return jsx(LinkStatusContext.Provider, { value: linkStatusValue, children: jsx("a", { ref: setRefs, href: fullHref, onClick: handleClick, ...anchorProps, children }) });
});
const export_d6422401ef32 = {
  default: BookmarkButton
};
const export_6451b87f0574 = {
  default: SearchBar
};
const export_a9bbde40cf2d = {
  default: Error
};
const export_f29e6e234fea = {
  ErrorBoundary,
  NotFoundBoundary
};
const export_0deffcb8ffd7 = {
  LayoutSegmentProvider
};
const export_c2747888630f = {
  default: Link
};
export {
  export_0deffcb8ffd7,
  export_6451b87f0574,
  export_a9bbde40cf2d,
  export_c2747888630f,
  export_d6422401ef32,
  export_f29e6e234fea
};
