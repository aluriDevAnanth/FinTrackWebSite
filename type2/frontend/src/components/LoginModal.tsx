import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent } from "react";

import trpc from "../trpc";
import * as types from "src/schema";
import { useAuth } from "src/context/AuthCon";

export default function LoginModal() {
  const { login } = useAuth();

  async function handleLoginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const formData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );
    console.log(formData);
    const { auth, user } = await trpc.auth.login.query({
      usernameOrEmail: formData.usernameOrEmail as string,
      password: formData.password as string,
    });
    console.log({ auth, user });
    login(auth, await types.UserS.validate(user));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Signup</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLoginSubmit} className="grid gap-4 ">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="usernameOrEmail" className="text-right">
              Username Or Email
            </Label>
            <Input
              name="usernameOrEmail"
              id="usernameOrEmail"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input name="password" id="password" className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
