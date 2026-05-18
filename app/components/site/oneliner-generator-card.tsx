"use client";

import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "@/app/components/ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod"
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet} from "@/app/components/ui/field";
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea} from "@/app/components/ui/input-group";
import OneLinerGeminiCommunication from "@/backend/oneliner/api/route";
import * as z from "zod";


export const formSchema = z.object({
    target: z.enum(["Businesses", "Consumers", "Both"]),
    industry: z
      .string()
      .min(5, "Industry must be at least 5 characters.")
      .max(60, "Industry must be at most 60 characters."),
    name: z
      .string()
      .min(2, "Name of product must be at least 2 characters.")
      .max(30, "Name of product must be at most 30 characters."),
    explanation: z
      .string()
      .min(5, "Explanation must be at least 5 characters.")
      .max(512, "Explanation must be at most 512 characters."),
    user: z
      .string()
      .min(5, "Ideal user must be at least 5 characters.")
      .max(64, "Ideal user must be at most 64 characters."),
    problem: z
      .string()
      .min(5, "Problem must be at least 5 characters.")
      .max(64, "Problem must be at most 64 characters."),
    result: z
      .string()
      .min(5, "Result must be at least 5 characters.")
      .max(64, "Result must be at most 64 characters."),
    unique: z
      .string()
      .min(5, "Uniqueness must be at least 5 characters.")
      .max(128, "Uniqueness must be at most 128 characters."),
  });

export default function OneLinerGenerator() {
  
const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            target: "Businesses",
            industry: "",
            name: "",
            explanation: "",
            user: "",
            problem: "",
            result: "",
            unique: "",
        },
    })

  

  // businesses, consumers, both (target)
  // industry you are targetting (industry)
  // what is the name of your product (name)
  // in simple terms, what does your product do (explanation)
  // who is your ideal user? (user)
  // what problem does it solve?  (problem)
  // what is the biggest result users get from your product (result)
  // what makes it better, faster, cheaper, easier, or more unique than existing options? (unique)

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("beginning to generate");
    console.log("form submission: ", data);

    const toastPromise = OneLinerGeminiCommunication(data);

    toast.promise(toastPromise, {
      loading: "Generating...",
      success: "One-liners generated!",
      error: "Something went wrong. "
    });

    const generatedOneLiners = await toastPromise;

    console.log(generatedOneLiners);
    // call api's, update values, etc

    // implement promise, once data is verified in prisma, router push to /one-liner (history)
  }

  

  return (
  <Card className="mx-auto w-full max-w-3xl overflow-hidden px-5">
    <CardHeader className="flex flex-col items-center text-center">
      <CardTitle className="text-4xl">One Liner Generator</CardTitle>
      <CardDescription>
        Fill out the form below to generate some catchy one liners which
        perfectly describe your product!
      </CardDescription>
    </CardHeader>

    <CardContent className="w-full min-w-0">
      <form
        id="oneliner"
        onSubmit={form.handleSubmit(
          onSubmit,
          (errors) => {
            console.log("Form verification failed:", errors);
          }
        )}
        className="w-full min-w-0"
      >
        <FieldGroup className="w-full min-w-0">
          <FieldSet className="w-full min-w-0">
            <div className="flex flex-row">
                <Controller
                  name="target"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="w-full min-w-0">
                      <FieldLabel>Who are you targeting?</FieldLabel>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid gap-3"
                      >
                        <Field orientation="horizontal">
                          <RadioGroupItem value="Businesses" id="target-businesses" />
                          <FieldLabel htmlFor="target-businesses">
                            Businesses
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <RadioGroupItem value="Consumers" id="target-consumers" />
                          <FieldLabel htmlFor="target-consumers">
                            Consumers
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <RadioGroupItem value="Both" id="target-both" />
                          <FieldLabel htmlFor="target-both">Both</FieldLabel>
                        </Field>
                      </RadioGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="industry"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="w-full min-w-0">
                      <FieldLabel htmlFor="industry-response">
                        What industry are you building in?
                      </FieldLabel>
                      <InputGroup className="w-full min-w-0 overflow-hidden">
                        <InputGroupTextarea
                          {...field}
                          id="industry-response"
                          placeholder="Finance, Restaurant, Marketing, etc."
                          rows={6}
                          maxLength={60}
                          className="min-h-10 w-full min-w-0 resize-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value?.length ?? 0}/60 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
            </div>

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-full min-w-0">
                  <FieldLabel htmlFor="name-response">
                    What&apos;s the name of your product/company?
                  </FieldLabel>

                  <InputGroup className="w-full min-w-0 overflow-hidden">
                    <InputGroupTextarea
                      {...field}
                      id="name-response"
                      placeholder="Dysipher, FundScout, Lexia, etc."
                      rows={6}
                      maxLength={30}
                      className="min-h-10 w-full min-w-0 resize-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                      aria-invalid={fieldState.invalid}
                    />

                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value?.length ?? 0}/30 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="explanation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-full min-w-0">
                  <FieldLabel htmlFor="explanation-response">
                    In simple terms, what does your solution do? 
                  </FieldLabel>

                  <InputGroup className="w-full min-w-0 overflow-hidden">
                    <InputGroupTextarea
                      {...field}
                      id="explanation-response"
                      placeholder="Turning dormant, unorganized data into interpretable, actionable insights."
                      rows={6}
                      maxLength={512}
                      className="min-h-10 w-full min-w-0 resize-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                      aria-invalid={fieldState.invalid}
                    />

                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value?.length ?? 0}/512 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="user"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-full min-w-0">
                  <FieldLabel htmlFor="user-response">
                    Who is your ideal user?
                  </FieldLabel>

                  <InputGroup className="w-full min-w-0 overflow-hidden">
                    <InputGroupTextarea
                      {...field}
                      id="user-response"
                      placeholder="HR, Doctors, Coaches, etc."
                      rows={6}
                      maxLength={64}
                      className="min-h-10 w-full min-w-0 resize-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                      aria-invalid={fieldState.invalid}
                    />

                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value?.length ?? 0}/64 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="problem"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-full min-w-0">
                  <FieldLabel htmlFor="problem-response">
                    What problem does your solution solve?
                  </FieldLabel>

                  <InputGroup className="w-full min-w-0 overflow-hidden">
                    <InputGroupTextarea
                      {...field}
                      id="user-response"
                      placeholder="Managers have to deal with messy paperwork."
                      rows={6}
                      maxLength={64}
                      className="min-h-10 w-full min-w-0 resize-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                      aria-invalid={fieldState.invalid}
                    />

                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value?.length ?? 0}/64 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="result"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-full min-w-0">
                  <FieldLabel htmlFor="problem-response">
                    What is the biggest outcome from using your solution?
                  </FieldLabel>

                  <InputGroup className="w-full min-w-0 overflow-hidden">
                    <InputGroupTextarea
                      {...field}
                      id="user-response"
                      placeholder="Saves money and time."
                      rows={6}
                      maxLength={64}
                      className="min-h-10 w-full min-w-0 resize-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                      aria-invalid={fieldState.invalid}
                    />

                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value?.length ?? 0}/64 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="unique"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-full min-w-0">
                  <FieldLabel htmlFor="unique-response">
                    What makes it better, faster, cheaper, easier, or more unique than existing options?
                  </FieldLabel>

                  <InputGroup className="w-full min-w-0 overflow-hidden">
                    <InputGroupTextarea
                      {...field}
                      id="user-response"
                      placeholder="First web-based application to support multiple employee-accounts."
                      rows={6}
                      maxLength={128}
                      className="min-h-10 w-full min-w-0 resize-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                      aria-invalid={fieldState.invalid}
                    />

                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value?.length ?? 0}/128 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldSet>
        </FieldGroup>
      </form>
    </CardContent>

    <CardFooter className="flex justify-end">
      <Button type="submit" form="oneliner" size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
        Submit
      </Button>
    </CardFooter>
  </Card>
);
}
