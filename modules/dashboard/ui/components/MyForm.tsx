"use client";
import { Subscription } from "@/types/Subscription";
import { BellIcon, Calendar, IndianRupee, NotebookText } from "lucide-react";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch"


export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Subscription>();

  const onSubmit = (data: Subscription) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <div className="flex flex-row gap-2">
      <input
        {...register("name", { required: true })}
        className="border p-2 w-[48%] rounded"
        placeholder="Subscription Name"
        />
        {errors.name && <p className="text-red-500 text-sm">Required</p>}

        <select
            {...register("category", { required: true })}
        className="border p-2 w-[48%] rounded"
        >
            <option value="Entertainment">Entertainment</option>
            <option value="Productivity">Productivity</option>
            <option value="Health & Fitness">Health & Fitness</option>
            <option value="Development">Development</option>
            <option value="Cloud">Cloud</option>
            <option value="Learning">Learning</option>
            
            {/* "Entertainment" | "Productivity" | "Health & Fitness" | "Development" | "Cloud" | "Learning" */}
        </select>
        {errors.name && <p className="text-red-500 text-sm">Required</p>}
      </div>

      <textarea
        {...register("description")}
        className="border-2 border-dashed p-2 w-full  h-32"
        placeholder="Description"
        ></textarea>
      <hr  className="w-full"/>
      <div className="flex flex-row items-center gap-2">
      <NotebookText  size={17} className="text-muted-foreground" />
      <p className="text-md">Basic Information</p>
      <p  className="border border-input bg-slate-100/10 rounded-full text-[12px] font-extrabold px-2 pt-0.5">Optional </p>
      </div>
      <input
        {...register("url")}
        className="border p-2 w-full rounded"
        placeholder="URL"
      />
      <textarea
        {...register("notes")}
        className="border-2 border-dashed p-2 w-full  h-32"
        placeholder="Extra Notes"
        ></textarea>

      <div className="flex flex-row gap-2 items-center">
        <IndianRupee size={17} className="text-muted-foreground"/>
        <p>Billing Details</p>
        <p className="border border-input rounded-full text-[12px] font-extrabold px-2">
              Required
        </p>
      </div>

      <input
        {...register("amount", { required: true })}
        type="number"
        step="0.01"
        className="border p-2 w-full rounded"
        placeholder="Amount"
        />
        {errors.amount && <p className="text-red-500 text-sm">Required</p>}

      <input
        {...register("currency", { required: true })}
        className="border p-2 w-full rounded"
        placeholder="Currency (INR, USD, etc)"
        />
        {errors.currency && <p className="text-red-500 text-sm">Required</p>}

      <select
        {...register("cycleType", { required: true })}
        className="border p-2 w-full rounded"
      >
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
        {errors.cycleType && <p className="text-red-500 text-sm">Required</p>}

      <input
        {...register("cycleCount", { required: true })}
        type="number"
        className="border p-2 w-full rounded"
        placeholder="Cycle Count"
        />
        {errors.cycleCount && <p className="text-red-500 text-sm">Required</p>}

      <hr  className="w-full"/>
      
      <div className="flex flex-row gap-2 items-center">
        <Calendar size={17} className="text-muted-foreground" />
        <span className="text-md">Billing Cycle</span>
        <p className="border border-input bg-slate-100/10 rounded-full text-[12px] font-extrabold px-2 pt-0.5">
          Auto-filled
        </p>
      </div>

    <div className="flex flex-row gap-2">
      <input
        {...register("startBilling", { required: true })}
        type="date"
        className="border p-2 w-full rounded"
        />
        {errors.startBilling && <p className="text-red-500 text-sm">Required</p>}

      <input
        {...register("nextBilling", { required: true })}
        type="date"
        className="border p-2 w-full rounded"
        />
        {errors.nextBilling && <p className="text-red-500 text-sm">Required</p>}
    </div>

      <hr  className="w-full"/>
    <div className="flex flex-row gap-2 items-center">
      <BellIcon size={17} className="text-muted-foreground" />
      <span className="text-md">Reminders</span>
      <p  className="border border-input bg-slate-100/10 rounded-full text-[12px] font-extrabold px-2 pt-0.5">Optional </p>
    </div>
      <label className="flex items-center justify-between w-full">
          <div>
            <span className="text-foreground ">Set reminder for this subscription</span>
            <p className="text-muted-foreground text-sm">Get notified at a specific time before renewal</p>
          </div>
          <Switch className="cursor-pointer"    {...register("reminder")} />
          {errors.reminder && <p className="text-red-500 text-sm">Required</p>}
      </label>

    </form>
  );
}
