const links = {
  home: { href: "/", label: "Home" },
  activities: { href: "/activities", label: "Activities" },
  tags: { href: "/tags", label: "Tags" },
  account: { href: "/account", label: "Account" },
  pricing: { href: "/pricing", label: "Pricing" },
  signIn: { href: "/sign-in", label: "Sign in" },
  signUp: { href: "/sign-up", label: "Sign up" },
} as const;

type LinkName = keyof typeof links;

export function navigationLinks(pathname: string, signedIn: boolean) {
  const path = pathname.replace(/\/+$/, "") || "/";
  let names: LinkName[] = [];
  let current: LinkName | undefined;

  if (path === "/") {
    names = signedIn ? ["activities", "account"] : ["pricing", "signIn", "signUp"];
  } else if (path === "/pricing") {
    names = signedIn ? ["home", "account"] : ["home", "signIn", "signUp"];
  } else if (path === "/sign-in" || path === "/sign-up") {
    names = ["home"];
  } else if (path === "/subscribe") {
    names = ["pricing", "account"];
  } else if (path === "/account") {
    names = ["activities", "account"];
    current = "account";
  } else if (path === "/activities") {
    names = ["tags", "account"];
  } else if (path === "/tags") {
    names = ["activities", "account"];
  } else if (/^\/(?:activities|tag)\/[^/]+$/.test(path)) {
    names = ["activities", "account"];
    current = "activities";
  }

  return names.map((name) => ({ ...links[name], current: name === current }));
}
