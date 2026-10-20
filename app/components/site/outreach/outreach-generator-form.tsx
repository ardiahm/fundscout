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
import { Control, Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
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
import OutreachGeminiCommunication from "@/backend/api/outreach/generateOutreach";
import { useRouter } from "next/navigation";
import {
  OutreachAsk,
  OutreachMethod,
  OutreachTone,
  OutreachLength,
} from "@/backend/lib/generated/prisma/enums";
import {
  outreachFormSchema,
  type OutreachFormValues,
  outreachAskLabels,
  outreachMethodLabels,
  outreachToneLabels,
  outreachLengthLabels,
} from "@/backend/constants/outreach";

export default function OutreachGeneratorForm() {
  const router = useRouter();

  const form = useForm<OutreachFormValues>({
    resolver: zodResolver(outreachFormSchema),
    defaultValues: {
      sender: "",
      recipient: "",
      reason: "",

      ask: OutreachAsk.BOOK_A_CALL,
      method: OutreachMethod.EMAIL,
      tone: OutreachTone.PROFESSIONAL,
      length: OutreachLength.SHORT,
    },
  });

  async function onSubmit(data: OutreachFormValues) {
    try {
      console.log("beginning to generate");
      console.log("form submission: ", data);

      const toastId = toast.loading("Generating...");

      const result = await OutreachGeminiCommunication(data);

      if (!result.success) {
        toast.error(result.error, {
          id: toastId,
        });

        return;
      }

      toast.success(
        `Outreach generated! ${result.remaining} generations remaining today.`,
        {
          id: toastId,
        },
      );

      console.log(result.data);

      router.replace("/outreach", { scroll: true });
    } catch (error) {
      toast.error("Something went wrong while generating outreach.");

      console.error("Unexpected generation error:", error);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-3xl overflow-hidden px-5">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle className="text-4xl">Outreach Generator</CardTitle>
        <CardDescription>
          Tell us who you are, who you&apos;re writing to and why, and
          we&apos;ll draft the email or message for you!
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full min-w-0">
        <form
          id="outreach"
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Form verification failed:", errors);
          })}
          className="w-full min-w-0"
        >
          <FieldGroup className="w-full min-w-0">
            <FieldSet className="w-full min-w-0">
              <TextAreaField
                control={form.control}
                name="sender"
                label="Who are you?"
                placeholder="Ahmed, founder of FundScout. Previously built payments infrastructure at a Series B fintech."
                maxLength={300}
                rows={3}
              />
              <TextAreaField
                control={form.control}
                name="recipient"
                label="Who are you writing to?"
                placeholder="Jordan Lee, partner at Sequoia who led seed rounds in developer tools."
                maxLength={300}
                rows={3}
              />
              <TextAreaField
                control={form.control}
                name="reason"
                label="Why are you reaching out?"
                placeholder="We met at YC Demo Day in March. Their portfolio overlaps with what I'm building, and I'd value their take before we raise."
                maxLength={1000}
                rows={6}
              />
              <ChoiceField
                control={form.control}
                name="ask"
                label="What do you want from them?"
                labels={outreachAskLabels}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
              />
            </FieldSet>

            {/* ================= Style ================= */}
            <FieldSet className="w-full min-w-0">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                <ChoiceField
                  control={form.control}
                  name="method"
                  label="Format"
                  labels={outreachMethodLabels}
                />
                <ChoiceField
                  control={form.control}
                  name="tone"
                  label="Tone"
                  labels={outreachToneLabels}
                />
                <ChoiceField
                  control={form.control}
                  name="length"
                  label="Length"
                  labels={outreachLengthLabels}
                />
              </div>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          form="outreach"
          size="lg"
          className="px-8 py-6 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ---------- Text field helper ---------- */

type TextFieldName = "sender" | "recipient" | "reason";

function TextAreaField({
  control,
  name,
  label,
  placeholder,
  maxLength,
  rows = 1,
}: {
  control: Control<OutreachFormValues>;
  name: TextFieldName;
  label: string;
  placeholder: string;
  maxLength: number;
  rows?: number;
}) {
  const id = `${name}-response`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="w-full min-w-0">
          <FieldLabel htmlFor={id}>{label}</FieldLabel>

          <InputGroup className="w-full min-w-0 overflow-hidden">
            <InputGroupTextarea
              {...field}
              id={id}
              placeholder={placeholder}
              rows={rows}
              maxLength={maxLength}
              className="min-h-10 w-full min-w-0 resize-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
              aria-invalid={fieldState.invalid}
            />

            <InputGroupAddon align="block-end">
              <InputGroupText className="tabular-nums">
                {field.value?.length ?? 0}/{maxLength} characters
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

/* ---------- Choice field helper ---------- */

type ChoiceFieldName = "ask" | "method" | "tone" | "length";

function ChoiceField({
  control,
  name,
  label,
  labels,
  className = "grid gap-3",
}: {
  control: Control<OutreachFormValues>;
  name: ChoiceFieldName;
  label: string;
  labels: Record<string, string>;
  // layout of the options; a single column by default
  className?: string;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="w-full min-w-0">
          <FieldLabel>{label}</FieldLabel>
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className={className}
          >
            {Object.entries(labels).map(([value, optionLabel]) => (
              <Field key={value} orientation="horizontal">
                <RadioGroupItem value={value} id={`${name}-${value}`} />
                <FieldLabel htmlFor={`${name}-${value}`} className="font-normal">
                  {optionLabel}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
