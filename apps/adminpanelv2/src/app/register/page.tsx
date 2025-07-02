
import { Button } from "@/components/ui/button";
import { Input } from "@mui/material";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <form className="flex flex-col gap-4 w-full max-w-md mobile:w-full p-4 bg-[#111827] rounded-lg">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-bold">DriveApp</h1>
        </div>
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button>Register</Button>
      </form>
    </div>
  );
}
