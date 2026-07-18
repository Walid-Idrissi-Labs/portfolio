 
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { CircleArrowDown } from "lucide-react";

const items = [
  {
    id: "1",
    title: "Who am I?",
    content:
      "I'm Walid, a computer networks and systems engineering student at Cadi Ayyad University. I build things for the web and the cloud, and I'm always working on something new.",
  },
  {
  id: "2",
  title: "What I build",
  content:
    "Full-stack web apps and cloud infrastructure. I care about things being well-structured, scalable, and actually shipped.",
},
  {
    id: "3",
    title: "My approach",
    content:
      "I try to understand how something works before I use it. That's why I go from theory in class to deployed projects. It's the fastest way to find out what I actually don't know yet.",
  },
  {
    id: "4",
    title: "My toolkit",
    content:
      "Next.js and TypeScript on the frontend, AWS and Terraform on the infrastructure side. Comfortable with Linux, Docker, and relational databases. Still learning, always.",
  },
  {
    id: "5",
    title: "Currently studying",
    content:
      "Working toward the AWS Certified Cloud Practitioner. Also going deeper into machine learning and Python through coursework and side projects.",
  },
  {
    id: "6",
    title: "Let's connect",
    content: (
      <div className="space-y-10">
        <p>
          You can reach me at id.la.walid@gmail.com or find me on GitHub and
          LinkedIn. Open to internships, collaborations, and interesting
          problems.
        </p>

        <a
          href="#contact"
          className="group flex w-full items-center justify-between rounded-2xl border border-beige_bright/25 bg-beige_bright/8 px-5 py-4 text-beige_bright transition-all duration-300 hover:border-beige_bright/60 hover:bg-beige_bright/12 md:px-6 md:py-5 lg:mx-auto lg:w-[94%] xl:w-[90%]"
        >
          <div className="space-y-1 text-left">
            <p className="text-sm uppercase tracking-[0.24em] text-beige_bright/60 md:text-base">
              Get In Touch?
            </p>
            <p className="text-base font-medium md:text-lg lg:text-xl">
              Head down to the contact section and send me a message.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-beige_bright/35 bg-beige_bright/10 transition-transform duration-300 ease-out group-hover:scale-110  md:h-14 md:w-14">
            <CircleArrowDown className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </a>
      </div>
    ),
  },
];

export function AccordionSection() {
  return (
    <div className="w-[90vw] mx-auto">
      <Accordion type="single" collapsible className="">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="last:border-b">
            <AccordionTrigger className="cursor-pointer overflow-hidden pl-6 text-left duration-300 ease-in-out hover:no-underline -space-y-5 data-[state=open]:space-y-0 md:pl-14 [&>svg]:hidden [&_h1]:text-[#d9d9d9] [&_h1]:transition-colors [&_h1]:duration-200 [&_p]:text-[#d9d9d9] [&_p]:transition-colors [&_p]:duration-200 data-[state=open]:[&_h1]:text-beige_bright data-[state=open]:[&_p]:text-beige_bright/90">
              <div className="flex flex-1 items-start gap-3 transition-[margin-block-start,margin-block-end] duration-300 ease-in-out md:gap-5">
                <p className="pt-1 text-sm md:text-base lg:text-lg">{item.id}</p>
                <h1
                  className="relative min-w-0 text-left text-[1.7rem] uppercase font-unbounded font-medium leading-none wrap-break-word sm:text-[2.15rem] md:text-5xl md:font-bold lg:text-[4.2rem]"
                >
                  {item.title}
                </h1>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-6 pl-6 font-unbounded font-light text-lg leading-relaxed text-neutral-200 md:px-20 md:text-xl lg:text-2xl">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
