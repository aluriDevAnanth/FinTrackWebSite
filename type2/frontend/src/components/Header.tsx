import { Menu } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    loginOp: {
      title: string;
      url: string;
    };
    signupOp: {
      title: string;
      url: string;
    };
  };
}

import { Link } from "@tanstack/react-router";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import { useAuth } from "src/context/AuthCon";

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} to={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      to={item.url}
    >
      <div>
        <div className="text-foreground">{item.icon}</div>
        <div>
          <div className="text-sm font-semibold">{item.title}</div>
          {item.description && (
            <p className="text-sm leading-snug text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

const Header = ({
  logo = {
    url: "/",
    src: "",
    alt: "logo",
    title: "FinTrack",
  },
  menu = [
    { title: "Incomes", url: "/incomes" },
    { title: "Expenses", url: "/expenses" },
    { title: "Transactions", url: "/transactions" },
    { title: "Budgets", url: "/budgets" },
    { title: "Savings Goal", url: "/savingsGoal" },
  ],
  auth = {
    loginOp: { title: "Login", url: "#" },
    signupOp: { title: "Sign up", url: "#" },
  },
}: Navbar1Props) => {
  const { user, auth: authToken, logout } = useAuth();

  return (
    <section className="py-4 max-w-[100vw]">
      <div className="container">
        <nav className="hidden lg:flex items-center justify-between">
          <Link to="/" href={logo.url} className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tighter">
              {logo.title}
            </span>
          </Link>

          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {!authToken && !user ? (
            <div className="flex gap-2 items-center">
              <LoginModal />
              <SignupModal />
            </div>
          ) : (
            <>
              <Button variant="destructive" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </nav>

        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link
              to={logo.url}
              className="flex items-center gap-2 text-xl font-bold"
            >
              {logo.title}
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      to={logo.url}
                      className="flex items-center gap-2  text-xl font-bold"
                    >
                      {logo.title}
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <Button variant="outline">
                      <Link to={auth.loginOp.url}>{auth.loginOp.title}</Link>
                    </Button>
                    <Button>
                      <Link to={auth.signupOp.url}>{auth.signupOp.title}</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
