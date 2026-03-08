import { Heart, Share2, Star, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const DesignCard = ({ id, image, title, category, style, price, rating, type }) => {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="group premium-card rounded-2xl overflow-hidden"
    >
      <Link to={`/design/${id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-foreground/80 backdrop-blur-sm text-background text-xs font-semibold px-3 py-1.5 rounded-full">
            {style}
          </span>
          {type && (
            <Badge variant="secondary" className="text-xs font-semibold rounded-full backdrop-blur-sm">
              {type}
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-[var(--shadow-md)] hover:scale-110 transition-transform"
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-[var(--shadow-md)] hover:scale-110 transition-transform"
          >
            <Share2 className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-bold text-base leading-tight truncate">{title}</h3>
            <p className="text-muted-foreground text-sm mt-1">{category}</p>
          </div>
          <Link to={`/design/${id}`} className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
          <span className="font-bold text-foreground text-lg">{price}</span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            {rating}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DesignCard;
