"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ImageModal from "@/components/image-modal";
import { FiLogOut, FiHeart, FiCamera, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface ImageItem {
  name: string;
  url: string;
  contentType: string;
  createdOn: string;
  size: number;
}

interface PaginationData {
  images: ImageItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function HomePage() {
  const [paginationData, setPaginationData] = useState<PaginationData>({
    images: [],
    totalCount: 0,
    page: 1,
    pageSize: 5,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // Fetch images on component mount and when page changes
  useEffect(() => {
    fetchImages(1);
  }, [router]);

  // Auto-advance slideshow
  useEffect(() => {
    if (paginationData.images.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % paginationData.images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [paginationData.images]);

  async function fetchImages(page: number) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/images/list?page=${page}&pageSize=${paginationData.pageSize}`);
      
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      
      const data = await response.json();
      setPaginationData(data);
      // Reset current slide when fetching new images
      setCurrentSlide(0);
    } catch (error) {
      setError("Error loading images. Please try again later.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNextPage = () => {
    if (paginationData.page < paginationData.totalPages) {
      fetchImages(paginationData.page + 1);
    }
  };

  const handlePrevPage = () => {
    if (paginationData.page > 1) {
      fetchImages(paginationData.page - 1);
    }
  };

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-pink-100/50 rounded-bl-full z-0"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-100/50 rounded-tr-full z-0"></div>
      
      <header className="border-b border-pink-200/60 bg-white/60 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FiHeart className="text-pink-500 h-5 w-5" />
            <h1 className="text-2xl font-medium text-pink-600">Our Romantic Space</h1>
          </div>
          <Button 
            onClick={handleLogout}
            className="romantic-button flex items-center space-x-1"
          >
            <FiLogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col overflow-hidden z-10 py-4">
        <div className="container mx-auto px-4 flex flex-col h-full">
          
          {/* Slideshow Section - Now Adaptive Height */}
          <div className="flex-grow flex flex-col overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center flex-grow">
                <div className="p-8 romantic-card bg-white/80 text-pink-500">
                  <div className="animate-pulse flex flex-col items-center">
                    <FiHeart className="h-8 w-8 mb-3" />
                    <p>Loading our precious moments...</p>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500 bg-red-50 rounded-2xl romantic-shadow flex-grow flex items-center justify-center">
                {error}
              </div>
            ) : paginationData.images.length === 0 ? (
              <div className="text-center p-12 romantic-card bg-white/80 flex-grow flex items-center justify-center">
                <div>
                  <FiHeart className="h-10 w-10 text-pink-300 mx-auto mb-4" />
                  <p className="text-pink-400">No images found. Upload some romantic moments to see them here!</p>
                </div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto bg-white/40 p-6 rounded-3xl shadow-lg romantic-card flex-grow flex flex-col w-full">
                <h3 className="text-center text-pink-600 font-medium mb-3">Our Moments Slideshow</h3>
                <div className="flex-grow relative rounded-2xl bg-pink-50 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={paginationData.images[currentSlide]?.url || ''}
                          alt={`Slideshow image ${currentSlide + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 1000px"
                          className="object-contain"
                          priority
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                          <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                          >
                            {paginationData.images[currentSlide]?.name} - {new Date(paginationData.images[currentSlide]?.createdOn).toLocaleDateString()}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Slideshow Controls */}
                  <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + paginationData.images.length) % paginationData.images.length)}
                      className="bg-white/80 hover:bg-white text-pink-500 h-10 w-10 rounded-full flex items-center justify-center shadow-md"
                    >
                      <FiChevronLeft className="h-5 w-5" />
                    </motion.button>
                  </div>
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % paginationData.images.length)}
                      className="bg-white/80 hover:bg-white text-pink-500 h-10 w-10 rounded-full flex items-center justify-center shadow-md"
                    >
                      <FiChevronRight className="h-5 w-5" />
                    </motion.button>
                  </div>
                  
                  {/* Slideshow Navigation Dots */}
                  <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 z-10">
                    {paginationData.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full ${
                          currentSlide === index ? "bg-white scale-125" : "bg-white/50"
                        } transition-all duration-300`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Pagination Controls */}
                <div className="flex justify-center mt-4 space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevPage}
                    disabled={paginationData.page <= 1}
                    className={`px-3 py-1.5 rounded-xl flex items-center space-x-2 
                      ${paginationData.page <= 1 
                        ? 'bg-pink-100 text-pink-300 cursor-not-allowed' 
                        : 'bg-pink-100 text-pink-500 hover:bg-pink-200'
                      } transition-colors duration-300`}
                  >
                    <FiChevronLeft />
                    <span>Previous</span>
                  </motion.button>
                  
                  <div className="px-3 py-1.5 bg-white rounded-xl text-pink-500 font-medium text-sm">
                    Page {paginationData.page} of {paginationData.totalPages}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextPage}
                    disabled={paginationData.page >= paginationData.totalPages}
                    className={`px-3 py-1.5 rounded-xl flex items-center space-x-2 text-sm
                      ${paginationData.page >= paginationData.totalPages
                        ? 'bg-pink-100 text-pink-300 cursor-not-allowed'
                        : 'bg-pink-100 text-pink-500 hover:bg-pink-200'
                      } transition-colors duration-300`}
                  >
                    <span>Next</span>
                    <FiChevronRight />
                  </motion.button>
                </div>
                
                {/* Pagination Summary */}
                <div className="text-center mt-2 text-xs text-pink-400">
                  Showing image {currentSlide + 1} of {paginationData.images.length} (Page {paginationData.page} of {paginationData.totalPages})
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="border-t border-pink-200/60 bg-white/60 backdrop-blur-sm z-10">
        <div className="container mx-auto py-3 px-4 text-center">
          <p className="text-sm text-pink-400">Our Romantic Space &copy; {new Date().getFullYear()}</p>
          <p className="text-xs text-pink-300 mt-1">Just for us ❤️</p>
          <div className="flex justify-center mt-2 space-x-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-200"></span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-300"></span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-400"></span>
          </div>
        </div>
      </footer>

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          imageName={selectedImage.name}
        />
      )}
    </div>
  );
}
