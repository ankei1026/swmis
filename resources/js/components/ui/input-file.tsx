import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputLabel } from "@mui/material";
import FormLabel from "@/Pages/Components/FormLabel";

interface InputFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function InputFile({ label = "Upload File", id = "file", ...props }: InputFileProps) {
  return (
    <div className="grid w-full items-center gap-3">
      <FormLabel htmlFor={id} textLabel={"Upload Photo"}/>
      <Input id={id} type="file" {...props} />
    </div>
  );
}
