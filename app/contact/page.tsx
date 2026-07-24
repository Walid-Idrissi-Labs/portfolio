import PillNav from "@/app/components/page/pillnav-bit"
import { ContactExperience, ContactMarquee } from "@/app/components/page/contact"
import { InfiniteGrid } from "@/app/components/ui/bg-infinitegrid"
import { colors } from "@/app/lib/colors"

const walid_1 = "/walid_memoji_face1.png";
const walid_2 = "/walid_memoji_facewmac.png";

export const metadata = {
    title: "Contact",
    description: "Get in touch with Walid Idrissi — open to internships, collaborations, and ideas worth chasing.",
}

export default function ContactPage() {
    return (
        <div className="relative flex min-h-svh flex-col overflow-x-clip bg-black selection:bg-beige_bright selection:text-black">
            {/* Mouse-reactive grid backdrop */}
            <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
                <InfiniteGrid className="h-full w-full pointer-events-none" />
            </div>

            <section className="fixed inset-x-0 top-0 flex items-center justify-center px-6 xl:px-16 z-90">
                <div className="flex justify-around px-1 lg:px-1 font-ibm font-weight-500">
                    <PillNav
                        logos={[walid_1, walid_2]}
                        logoAlt="Walid"
                        items={[
                            { label: "About", href: "/#about" },
                            { label: "Projects", href: "/#projects" },
                            { label: "Contact", href: "/contact" },
                        ]}
                        activeHref="/contact"
                        className="custom-nav"
                        ease="power2.easeOut"
                        baseColor="#0d0d0d99"
                        pillColor="transparent"
                        hoveredPillTextColor={colors.beige_bright}
                        pillTextColor={colors.beige_bright}
                        initialLoadAnimation
                    />
                </div>
            </section>

            {/* pt clears the pinned nav — the memoji occupies y16–63 on mobile. */}
            <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-16 pt-28 md:px-10 md:pt-36">
                <ContactExperience />
            </main>

            <ContactMarquee />
        </div>
    )
}
