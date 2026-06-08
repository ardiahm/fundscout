"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "@/app/components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/app/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/app/components/ui/input-group";
import OneLinerGeminiCommunication from "@/backend/api/oneliner/generateOneLiners";
import "dotenv/config";
import { useRouter } from "next/navigation";
import {
  OutreachGoal,
  OutreachMethod,
  OutreachRelationship,
  OutreachCallToAction,
  OutreachTone,
  OutreachLength,
} from "@/backend/lib/generated/prisma/client";
import * as z from "zod";

export const formSchema = z.object({
  // Sender
  sender_name: z
    .string()
    .min(2, "Your name must be at least 2 characters.")
    .max(64, "Your name cannot be more than 64 characters."),

  sender_role: z
    .string()
    .min(4, "Your role must be at least 4 characters.")
    .max(64, "Your role cannot be more than 64 characters.")
    .optional(),

  sender_company: z
    .string()
    .min(4, "Your company must be at least 4 characters.")
    .max(64, "Your company cannot be more than 64 characters.")
    .optional(),

  sender_background: z
    .string()
    .min(4, "Your background must be at least 4 characters.")
    .max(500, "Your background cannot be more than 500 characters.")
    .optional(),

  // Recipient
  recipient_name: z
    .string()
    .min(4, "Recipient name must be at least 4 characters.")
    .max(64, "Recipient name cannot be more than 64 characters.")
    .optional(),

  recipient_role: z
    .string()
    .min(4, "Recipient role must be at least 4 characters.")
    .max(64, "Recipient role cannot be more than 64 characters.")
    .optional(),

  recipient_company: z
    .string()
    .min(4, "Recipient company must be at least 4 characters.")
    .max(64, "Recipient company cannot be more than 64 characters.")
    .optional(),

  recipient_industry: z
    .string()
    .min(4, "Recipient industry must be at least 4 characters.")
    .max(64, "Recipient industry cannot be more than 64 characters.")
    .optional(),

  // Outreach details
  goal: z.enum(OutreachGoal, {
    message: "Please select an outreach goal.",
  }),

  method: z.enum(OutreachMethod, {
    message: "Please select an outreach method.",
  }),

  relationship: z.enum(OutreachRelationship, {
    message: "Please select your relationship to the recipient.",
  }),

  relationship_context: z
    .string()
    .max(500, "Relationship context cannot be more than 500 characters.")
    .optional(),

  // Message context
  reason_for_reaching_out: z
    .string()
    .min(10, "Please give at least 10 characters of context.")
    .max(500, "Reason cannot be more than 1000 characters."),

  // Ask
  call_to_action: z.enum(OutreachCallToAction, {
    message: "Please select a call to action.",
  }),

  call_to_action_details: z
    .string()
    .max(500, "Call to action details cannot be more than 500 characters.")
    .optional(),

  // Style
  tone: z.enum(OutreachTone, {
    message: "Please select a tone.",
  }),

  length: z.enum(OutreachLength, {
    message: "Please select a length.",
  }),
});

export default function OutreachGeneratorForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender_name: "",
      sender_role: "",
      sender_company: "",
      sender_background: "",

      recipient_name: "",
      recipient_role: "",
      recipient_company: "",
      recipient_industry: "",

      goal: OutreachGoal.BOOK_A_MEETING,
      method: OutreachMethod.EMAIL,
      relationship: OutreachRelationship.COLD_OUTREACH,
      relationship_context: "",

      reason_for_reaching_out: "",

      call_to_action: OutreachCallToAction.SCHEDULE_A_CALL,
      call_to_action_details: "",

      tone: OutreachTone.PROFESSIONAL,
      length: OutreachLength.SHORT,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      console.log("beginning to generate");
      console.log("form submission: ", data);

      const toastId = toast.loading("Generating...");

      const result = await OneLinerGeminiCommunication(data);

      if (!result.success) {
        toast.error(result.error, {
          id: toastId,
        });

        return;
      }

      toast.success(
        `One-liners generated! ${result.remaining} generations remaining today.`,
        {
          id: toastId,
        },
      );

      console.log(result.data);

      router.replace("/one-liner", { scroll: true });
    } catch (error) {
      toast.error("Something went wrong while generating one-liners.");

      console.error("Unexpected generation error:", error);
    }
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
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Form verification failed:", errors);
          })}
          className="w-full min-w-0"
        >
          <FieldGroup className="w-full min-w-0">
            <FieldSet className="w-full min-w-0">
              <div className="flex flex-row">
                <Controller
                  name="target"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="w-full min-w-0"
                    >
                      <FieldLabel>Who are you targeting?</FieldLabel>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid gap-3"
                      >
                        <Field orientation="horizontal">
                          <RadioGroupItem
                            value="Businesses"
                            id="target-businesses"
                          />
                          <FieldLabel htmlFor="target-businesses">
                            Businesses
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <RadioGroupItem
                            value="Consumers"
                            id="target-consumers"
                          />
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
                    <Field
                      data-invalid={fieldState.invalid}
                      className="w-full min-w-0"
                    >
                      <FieldLabel htmlFor="industry-response">
                        What industry are you building in?
                      </FieldLabel>
                      <InputGroup className="w-full min-w-0 overflow-hidden">
                        <InputGroupTextarea
                          {...field}
                          id="industry-response"
                          placeholder="Finance, Restaurant, Marketing, etc."
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
              </div>

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="w-full min-w-0"
                  >
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
                  <Field
                    data-invalid={fieldState.invalid}
                    className="w-full min-w-0"
                  >
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
                  <Field
                    data-invalid={fieldState.invalid}
                    className="w-full min-w-0"
                  >
                    <FieldLabel htmlFor="user-response">
                      Who is your ideal user?
                    </FieldLabel>

                    <InputGroup className="w-full min-w-0 overflow-hidden">
                      <InputGroupTextarea
                        {...field}
                        id="user-response"
                        placeholder="HR, Doctors, Coaches, etc."
                        rows={6}
                        maxLength={256}
                        className="min-h-10 w-full min-w-0 resize-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                        aria-invalid={fieldState.invalid}
                      />

                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value?.length ?? 0}/256 characters
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
                  <Field
                    data-invalid={fieldState.invalid}
                    className="w-full min-w-0"
                  >
                    <FieldLabel htmlFor="problem-response">
                      What problem does your solution solve?
                    </FieldLabel>

                    <InputGroup className="w-full min-w-0 overflow-hidden">
                      <InputGroupTextarea
                        {...field}
                        id="user-response"
                        placeholder="Managers have to deal with messy paperwork."
                        rows={6}
                        maxLength={256}
                        className="min-h-10 w-full min-w-0 resize-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                        aria-invalid={fieldState.invalid}
                      />

                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value?.length ?? 0}/256 characters
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
                  <Field
                    data-invalid={fieldState.invalid}
                    className="w-full min-w-0"
                  >
                    <FieldLabel htmlFor="problem-response">
                      What is the biggest outcome from using your solution?
                    </FieldLabel>

                    <InputGroup className="w-full min-w-0 overflow-hidden">
                      <InputGroupTextarea
                        {...field}
                        id="user-response"
                        placeholder="Saves money and time."
                        rows={6}
                        maxLength={256}
                        className="min-h-10 w-full min-w-0 resize-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                        aria-invalid={fieldState.invalid}
                      />

                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value?.length ?? 0}/256 characters
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
                  <Field
                    data-invalid={fieldState.invalid}
                    className="w-full min-w-0"
                  >
                    <FieldLabel htmlFor="unique-response">
                      What makes it better, faster, cheaper, easier, or more
                      unique than existing options?
                    </FieldLabel>

                    <InputGroup className="w-full min-w-0 overflow-hidden">
                      <InputGroupTextarea
                        {...field}
                        id="user-response"
                        placeholder="First web-based application to support multiple employee-accounts."
                        rows={6}
                        maxLength={256}
                        className="min-h-10 w-full min-w-0 resize-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                        aria-invalid={fieldState.invalid}
                      />

                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value?.length ?? 0}/256 characters
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
        <Button
          type="submit"
          form="oneliner"
          size="lg"
          className="px-8 py-6 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
