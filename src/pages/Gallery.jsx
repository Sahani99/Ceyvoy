/* eslint-disable react/prop-types */
import { IoLocationSharp } from "react-icons/io5";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gallery } from "@/data/gallery";

const Gallery = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <Header />

      {/* gallery */}
      <section className="container mx-auto mt-20 px-4 py-8">
        <h1 className="mb-8 text-center text-2xl font-medium md:text-3xl">
          Gallery
        </h1>
        <Tabs defaultValue="all" className="">
          <div className="flex w-full justify-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="cultural">Cultural</TabsTrigger>
              <TabsTrigger value="nature">Nature</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
          </div>
          {/* all gallery */}
          <TabsContent value="all">
            <GalleryCards
              items={[...gallery.cultural, ...gallery.nature, ...gallery.other]}
            />
          </TabsContent>
          {/* cultural gallery */}
          <TabsContent value="cultural">
            <GalleryCards items={gallery.cultural} />
          </TabsContent>
          {/* nature gallery */}
          <TabsContent value="nature">
            <GalleryCards items={gallery.nature} />
          </TabsContent>
          {/* other gallery */}
          <TabsContent value="other">
            <GalleryCards items={gallery.other} />
          </TabsContent>
        </Tabs>
      </section>

      {/* flex grow for fill space */}
      <div className="flex-grow" />

      {/* footer */}
      <Footer />
    </div>
  );
};

const GalleryCards = ({ items }) => {
  if (!items?.length) {
    return (
      <div className="flex w-full items-center justify-center pt-5">
        <h1 className="text-gray-600">No gallery items found</h1>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items?.map((item) => (
        <div
          key={item.id}
          className="w-full max-w-md rounded-lg bg-white shadow-md drop-shadow-xl"
        >
          <img
            src={item.image}
            alt="gallery"
            className="h-48 w-full rounded-lg object-cover"
          />
          <div className="p-4">
            <h2 className="line-clamp-2 font-medium">{item.title}</h2>
            <p className="flex items-end gap-x-1 text-xs text-gray-600">
              <IoLocationSharp className="-ms-1 size-5 text-red-600" />
              {item.location}
            </p>
            <p className="mt-2 line-clamp-4 text-sm text-gray-700">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
