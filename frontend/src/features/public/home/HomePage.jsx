 import SiteHeader from "../header/SiteHeader";
 import Navbar from "../navbar/Navbar";
 import PublicFooter from "../footer/PublicFooter";
 import BreakingNews from "./BreakingNews";
 import HeroSlider from "./HeroSlider";
 import PrincipalWelcome from "./PrincipalWelcome";
 import YoutubeSection from "./YoutubeSection";
 import PlacementPartners from "./PlacementPartners";
 import GalleryPreview from "./GalleryPreview";
 import QuickLinks from "./QuickLinks";
 import Events from "./Events";
 import AboutCollege from "./AboutCollege";
//  import BottomInstitutional from "./BottomInstitutional";

import BottomInstitutional from "../header/BottomInstitutionalStrip";

 function HomePage() {
   return (
     <div className="w-full min-h-screen">

       <SiteHeader />
           <BottomInstitutional />
   {/* <div className="p-10 text-xl">
                 HOME PAGE TEST
             </div> */}
  

       <Navbar />

       <BreakingNews />

       <HeroSlider />

       <PrincipalWelcome />

       <QuickLinks />

       <AboutCollege />

       <Events />

       <PlacementPartners />

       <YoutubeSection />

       <GalleryPreview />

       <PublicFooter />

     </div>
   );
 }

 export default HomePage;

