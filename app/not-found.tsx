import GradientText from "./components/page/gradienttext-bit"
import AuroraSection from "./components/ui/aurora-section"
import StaticBackgroundBeamsSection from "./components/ui/staticbackgroundbeams-section"
import { Button } from "./components/utilities/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function NotFound() {
   return (

//     <Error404
//       postcardImage="/walid_memoji_full.jpg"
//       postcardAlt="New York City Postcard with Statue of Liberty"
//       curvedTextTop="Shaping What "
//       curvedTextBottom="Comes Next"
//       heading="(404) Looks like the page you're looking for got lost somewhere."
//       subtext="Let's get back on the homescreen..."
//       backButtonLabel="Back to Home"
//       backButtonHref="/"
//     />



      <section id="home" className = "flex relative w-full h-screen flex-col items-center justify-between p-0 bg-black opacity-47">
          <div className="absolute z-0 w-full h-full">
              <AuroraSection />
              <StaticBackgroundBeamsSection />
          </div> 
      
          <div className="relative z-1 px-10 py-5 flex flex-col gap-10 md:gap-20 xl:gap-27 sitems-center justify-center h-full w-full max-w-7xl text-2xl md:text-4xl xl:text-5xl font-unbounded font-extralight ">
                      <GradientText
                          colors={
                            [
                              "#f5f5f5" , "#f1f1f1" 
                            ]}
                          animationSpeed={0.3}
                          showBorder={false}
                          glass
                          className="custom-class"
                        >
                          404 Page Not Found 
                      </GradientText>
                  <Button asChild
                  className="rounded-lg px-6 py-3 border border-neutral-700 bg-neutral-900 text-[#90877F] hover:bg-neutral-900 max-w-xs mx-auto" >
                        <Link href={"/"} className="flex items-center gap-2">
                        {"Back to Home"}
                        <ArrowRight className="w-4 h-4" />
                        </Link>
                  </Button>
          </div>
      </section>

  )
}