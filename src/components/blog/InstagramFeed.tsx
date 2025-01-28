import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const instagramPosts = [
  {
    id: 1,
    image: "/lovable-uploads/3780f868-91c7-4512-bc4c-6af150baf90d.png",
    caption: "Introducing our latest eco-friendly collection! 🌿 #ElloriaCare",
    link: "https://instagram.com"
  },
  {
    id: 2,
    image: "/lovable-uploads/724f13b7-0a36-4896-b19a-e51981befdd3.png",
    caption: "Comfort meets sustainability 💚 #SustainableLiving",
    link: "https://instagram.com"
  },
  {
    id: 3,
    image: "/lovable-uploads/bf7261ba-df57-413d-b280-3b4b56528e73.png",
    caption: "Your daily companion for ultimate comfort ✨ #ElloriaCare",
    link: "https://instagram.com"
  },
  {
    id: 4,
    image: "/lovable-uploads/a7e9335a-6251-4ad6-9140-b04479d11e77.png",
    caption: "Innovation in feminine care 🌟 #WomenHealth",
    link: "https://instagram.com"
  },
  {
    id: 5,
    image: "/lovable-uploads/aef79d44-8c62-442e-b797-bf0446d818a8.png",
    caption: "Empowering women, one product at a time 💪 #WomenEmpowerment",
    link: "https://instagram.com"
  },
  {
    id: 6,
    image: "/lovable-uploads/c7fccc71-03c6-4d3d-8e7d-c7c710b91732.png",
    caption: "Join us in making a difference 🌍 #Sustainability",
    link: "https://instagram.com"
  }
];

export const InstagramFeed = () => {
  const [instagramProfileUrl, setInstagramProfileUrl] = useState("https://instagram.com");

  useEffect(() => {
    const fetchBlogSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_settings')
          .select('instagram_profile_url')
          .single();

        if (error) throw error;

        if (data?.instagram_profile_url) {
          setInstagramProfileUrl(data.instagram_profile_url);
          // Update post links
          instagramPosts.forEach(post => post.link = data.instagram_profile_url);
        }
      } catch (error) {
        console.error('Error fetching blog settings:', error);
      }
    };

    fetchBlogSettings();
  }, []);

  return (
    <section id="instagram-feed" className="py-20 bg-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Follow Our Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay connected with us on Instagram for daily inspiration, updates, and behind-the-scenes moments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-white">
                <p className="text-sm mb-4 text-center">{post.caption}</p>
                <Button
                  variant="secondary"
                  className="bg-white text-black hover:bg-gray-200"
                  onClick={() => window.open(instagramProfileUrl, '_blank')}
                >
                  View on Instagram
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
            onClick={() => window.open(instagramProfileUrl, '_blank')}
          >
            <Instagram className="mr-2 h-5 w-5" />
            Follow Us on Instagram
          </Button>
        </motion.div>
      </div>
    </section>
  );
};