"use client";

import { Subscription } from "@/types/Subscription";
import { BellIcon, Calendar, IndianRupee, NotebookText } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencySelect } from "./currency-select";
import { useEffect } from "react";

function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}

interface MyFormProps {
  onSubmit?: (data: Subscription) => void | Promise<void>;
  submitting?: boolean;
  initialValues?: Partial<Subscription>;
  prefillValues?: Partial<Subscription>;
}

export default function MyForm({ onSubmit, submitting = false, initialValues, prefillValues }: MyFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Subscription>({
    defaultValues: {
        url: initialValues?.url ?? "", 
      category: initialValues?.category ?? "Entertainment",
      reminder: initialValues?.reminder ?? false,
      cycleType: initialValues?.cycleType ?? "month",
      cycleCount: initialValues?.cycleCount ?? 1,
      logo_url: initialValues?.logo_url ?? "",
      ...initialValues,
      startBilling: initialValues?.startBilling
    ? formatDate(new Date(initialValues.startBilling))
    : "",
  nextBilling: initialValues?.nextBilling
    ? formatDate(new Date(initialValues.nextBilling))
    : "",
    }
  });

  const cycleType = watch("cycleType");
  const cycleCount = watch("cycleCount");

    useEffect(() => {
      if (!prefillValues) return;

      console.log(prefillValues);
      type SubscriptionKey = keyof Subscription;

      (Object.entries(prefillValues) as [SubscriptionKey, Subscription[SubscriptionKey]][])
        .forEach(([key, value]) => {
          if (value !== undefined) {
            setValue(key, value, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
        });
    }, [prefillValues, setValue]);


  // useEffect(() => {
  //   if (!cycleType || !cycleCount) return;

  //   const today = new Date();
  //   const startDate = today;
  //   const nextDate = new Date(today);

  //   if (cycleType === "month") {
  //     nextDate.setMonth(today.getMonth() + Number(cycleCount));
  //   } else if (cycleType === "year") {
  //     nextDate.setFullYear(today.getFullYear() + Number(cycleCount));
  //   }

  //   setValue("startBilling", formatDate(startDate));
  //   setValue("nextBilling", formatDate(nextDate));
  // }, [cycleType, cycleCount, setValue]);

  useEffect(() => {
  if (initialValues && initialValues.startBilling && initialValues.nextBilling) {
    console.log("Initial values for billing dates exist, skipping auto-fill.");
    return;
  }

  const today = new Date();
  const startDate = today;
  const nextDate = new Date(today);

  if (cycleType === "month") {
    nextDate.setMonth(today.getMonth() + Number(cycleCount));
  } else if (cycleType === "year") {
    nextDate.setFullYear(today.getFullYear() + Number(cycleCount));
  }

  setValue("startBilling", formatDate(startDate));
  setValue("nextBilling", formatDate(nextDate));
}, [cycleType, cycleCount, initialValues, setValue]);


  const handleFormSubmit = (data: Subscription) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const inputClass =
    "border border-input px-2 py-[7px] rounded w-full text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary";

  const secondClass =
    "border border-input px-2 py-2 rounded w-[40%] text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary ";

  const smallInputClass =
    "border border-input px-2 py-1 rounded text-sm w-full outline-none focus:border-primary focus:ring-2 focus:ring-primary";

  const textareaClass =
    "border border-input p-2 rounded w-full text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary";

  return (
    <form id="subscription-form" onSubmit={handleSubmit(onSubmit ??( () => {}))} className="space-y-4">
      <div className="flex flex-row gap-2 w-full ">
        <div className="flex-1">
          <input
            {...register("name", { required: "Subscription name is required" })}
            className={inputClass}
            placeholder="Subscription Name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="w-[48%]">
          <Controller
            control={control}
            name="category"
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={smallInputClass}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Productivity">Productivity</SelectItem>
                  <SelectItem value="Health & Fitness">
                    Health & Fitness
                  </SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Cloud">Cloud</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
          )}
        </div>
      </div>

      <textarea
        {...register("description")}
        className={textareaClass + " h-32"}
        placeholder="Description"
      />

      <hr className="w-full" />

      <div className="flex flex-row items-center gap-2">
        <NotebookText size={17} className="text-muted-foreground" />
        <p className="text-md">Basic Information</p>
        <p className="border border-input bg-slate-100/10 rounded-full text-[12px] font-extrabold px-2">
          Optional
        </p>
      </div>

      <input {...register("url")} className={inputClass} placeholder="URL" />
      
      <textarea
        {...register("notes")}
        className={textareaClass + " h-32"}
        placeholder="Extra Notes"
      />

      <div className="flex flex-row items-center gap-2">
        <IndianRupee size={17} className="text-muted-foreground" />
        <p>Billing Details</p>
        <p className="border border-input rounded-full text-[12px] font-extrabold px-2">
          Required
        </p>
      </div>

      <div className="flex flex-row gap-3 w-full">
        <div className="flex-1">
          <input
            {...register("amount", { 
              required: "Amount is required",
              min: { value: 0.01, message: "Amount must be greater than 0" }
            })}
            type="number"
            step="0.01"
            className={inputClass}
            placeholder="Amount"
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
          )}
        </div>
        <div className="flex-1 ml-auto ">
        <Controller
          control={control}
          name="currency"
          rules={{ required: "Currency is required" }}
          render={({ }) => (
            <button className="cursor-not-allowed">
            <CurrencySelect/>
            </button>
          )}
        />
        {errors.currency && (
          <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
        )}
          </div>
      </div>

      <div className="flex justify-between gap-1">
        <Controller
          control={control}
          name="cycleType"
          rules={{ required: "Cycle type is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className={`${smallInputClass} w-[50%]`}>
                <SelectValue placeholder="Cycle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <input
          {...register("cycleCount", { 
            required: "Cycle count is required",
            min: { value: 1, message: "Must be at least 1" }
          })}
          type="number"
          className={`w-[48%]! ${secondClass}`}
          placeholder="Cycle Count"
        />
      </div>

      <hr className="w-full" />

      <div className="flex flex-row gap-2 items-center">
        <Calendar size={17} className="text-muted-foreground" />
        <span className="text-md">Billing Cycle</span>
        <p className="border border-input bg-slate-100/10 rounded-full text-[12px] font-extrabold px-2">
          Auto-filled
        </p>
      </div>

      <div className="flex flex-row gap-2">
        <Controller
          control={control}
          name="startBilling"
          rules={{ required: "Start billing date is required" }}
          render={({ field }) => (
            <input
              type="date"
              className={inputClass}
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="nextBilling"
          rules={{ required: "Next billing date is required" }}
          render={({ field }) => (
            <input
              type="date"
              className={inputClass}
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <hr className="w-full" />

      <div className="flex flex-row gap-2 items-center">
        <BellIcon size={17} className="text-muted-foreground" />
        <span className="text-md">Reminders</span>
        <p className="border border-input bg-slate-100/10 rounded-full text-[12px] font-extrabold px-2">
          Optional
        </p>
      </div>

      <label className="flex items-center justify-between w-full">
        <div>
          <span className="text-foreground">
            Set reminder for this subscription
          </span>
          <p className="text-muted-foreground text-sm">
            Get notified at a specific time before renewal
          </p>
        </div>

        <Controller
          control={control}
          name="reminder"
          render={({ field }) => (
            <Switch 
              className="cursor-pointer scale-125"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </label>

      {/* <button
        type="submit"
        disabled={submitting}
        className="
          w-full bg-primary text-primary-foreground 
          py-2.5 rounded-md font-medium
          hover:opacity-90 transition-opacity
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {submitting ? "Adding Subscription..." : "Add Subscription"}
      </button> */}
    </form>
  );
}