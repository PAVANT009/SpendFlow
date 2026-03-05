import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "How does SpendFlow track my expenses?",
        answer:
            "You can share transactions through chat or upload records, and SpendFlow automatically categorizes each expense so your dashboard stays updated without manual entry.",
    },
    {
        question: "Can I set monthly budgets for specific categories?",
        answer:
            "Yes. You can create category-wise budgets like food, travel, shopping, and bills, then monitor progress in real time as your expenses are logged.",
    },
    {
        question: "Will I get alerts when I overspend?",
        answer:
            "Absolutely. SpendFlow sends smart alerts when you approach or cross limits, helping you adjust spending before the month ends.",
    },
    {
        question: "Is my financial data secure?",
        answer:
            "Yes. Your data is protected with secure authentication and controlled access, and we use security best practices to keep your information private.",
    },
    {
        question: "Does SpendFlow provide saving recommendations?",
        answer:
            "It does. The AI reviews recurring patterns, highlights unnecessary expenses, and suggests practical opportunities to reduce monthly spending.",
    },
    {
        question: "Can I use SpendFlow on both mobile and desktop?",
        answer:
            "Yes. SpendFlow is accessible across devices, so you can capture expenses on the go and review insights in detail on desktop.",
    },
];

export default function Faq() {
    return (
        <section id="faq" className="scroll-mt-28 mx-10 my-20">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Everything you need to know about how SpendFlow helps you manage
                        and optimize your spending.
                    </p>
                </div>

                <div className="rounded-2xl my-9 border border-border bg-card/50 p-6 ">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={faq.question} value={`item-${index}`}>
                                <AccordionTrigger className="text-base font-medium hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm leading-6 text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}

