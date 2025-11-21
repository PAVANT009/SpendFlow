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
import { currencyOptions } from "@/data/currency-options";
import { CommandSelect } from "@/components/ui/command-select";
import { CurrencySelect } from "./currency-select";

interface Option {
  value: string;
  label: string;
}

interface CommandSelectProps {
  placeholder?: string;
  value?: string;
  options: Option[];
  onSelect: (value: string) => void;
  className?: string;
}


export default function MyForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Subscription>();

  const onSubmit = (data: Subscription) => {
    console.log(data);
  };

  // Shared class for all inputs
  const inputClass =
    "border border-input px-2 py-2 rounded w-full text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary";

  const smallInputClass =
    "border border-input px-2 py-1 rounded text-sm w-[48%] outline-none focus:border-primary focus:ring-2 focus:ring-primary";

  const textareaClass =
    "border border-input p-2 rounded w-full text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      {/* FIRST ROW */}
      <div className="flex flex-row gap-2 w-full">
        
        <input
          {...register("name", { required: true })}
          className={smallInputClass}
          placeholder="Subscription Name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">Required</p>
        )}

        <Controller
          control={control}
          name="category"
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange(value)}
              value={field.value}
            >
              <SelectTrigger className={`${smallInputClass} w-[48%]`}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Productivity">Productivity</SelectItem>
                <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Cloud">Cloud</SelectItem>
                <SelectItem value="Learning">Learning</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-red-500 text-sm">Required</p>
        )}
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

      <input
        {...register("amount", { required: true })}
        type="number"
        step="0.01"
        className={inputClass}
        placeholder="Amount"
      />
      {errors.amount && <p className="text-red-500 text-sm">Required</p>}

        <Controller
          control={control}
          name="currency"
          rules={{ required: true }}
          render={({ field }) => (
            <CurrencySelect
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

      {errors.currency && (
        <p className="text-red-500 text-sm">Required</p>
      )}

      <select {...register("cycleType", { required: true })} className={inputClass}>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
      {errors.cycleType && <p className="text-red-500 text-sm">Required</p>}

      <input
        {...register("cycleCount", { required: true })}
        type="number"
        className={inputClass}
        placeholder="Cycle Count"
      />
      {errors.cycleCount && <p className="text-red-500 text-sm">Required</p>}

      <hr className="w-full" />

      <div className="flex flex-row gap-2 items-center">
        <Calendar size={17} className="text-muted-foreground" />
        <span className="text-md">Billing Cycle</span>
        <p className="border border-input bg-slate-100/10 rounded-full text-[12px] font-extrabold px-2">
          Auto-filled
        </p>
      </div>

      <div className="flex flex-row gap-2">
        <input
          {...register("startBilling", { required: true })}
          type="date"
          className={inputClass}
        />
        {errors.startBilling && <p className="text-red-500 text-sm">Required</p>}

        <input
          {...register("nextBilling", { required: true })}
          type="date"
          className={inputClass}
        />
        {errors.nextBilling && <p className="text-red-500 text-sm">Required</p>}
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
          <span className="text-foreground">Set reminder for this subscription</span>
          <p className="text-muted-foreground text-sm">
            Get notified at a specific time before renewal
          </p>
        </div>

        <Switch className="cursor-pointer" {...register("reminder")} />
      </label>
    </form>
  );
}
