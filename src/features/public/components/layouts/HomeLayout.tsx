import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import HomeNavbar from "../widgets/HomeNavbar";
import HomeFooter from "../widgets/HomeFooter";

function HomeLayout() {
  return (
    <>
      {/* SEO & Page Metadata */}
      <Helmet>
        <title>DefinePress - Latest News & Analysis</title>
        <meta
          name="description"
          content="Stay updated with the latest news, trending stories, and expert analysis on DefinePress."
        />
      </Helmet>

      {/* Navigation */}
      <HomeNavbar />

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <HomeFooter />
    </>
  );
}

export default HomeLayout;
