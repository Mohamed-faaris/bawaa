import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ArrowLeft, Navigation, PhoneCall } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const WhatsAppIcon = (props: { size?: number; className?: string }) => (
  <svg
    fill="currentColor"
    viewBox="0 0 360 362"
    width={props.size ?? 16}
    height={props.size ?? 16}
    className={props.className}
  >
    <path d="M307.546 52.566C273.709 18.684 228.706.017 180.756 0 81.951 0 1.538 80.404 1.504 179.235c-.017 31.594 8.242 62.432 23.928 89.609L0 361.736l95.024-24.925c26.179 14.285 55.659 21.805 85.655 21.814h.077c98.788 0 179.21-80.413 179.244-179.244.017-47.898-18.608-92.926-52.454-126.807v-.008Zm-126.79 275.788h-.06c-26.73-.008-52.952-7.194-75.831-20.765l-5.44-3.231-56.391 14.791 15.05-54.981-3.542-5.638c-14.912-23.721-22.793-51.139-22.776-79.286.035-82.14 66.867-148.973 149.051-148.973 39.793.017 77.198 15.53 105.328 43.695 28.131 28.157 43.61 65.596 43.593 105.398-.035 82.149-66.867 148.982-148.982 148.982v.008Zm81.719-111.577c-4.478-2.243-26.497-13.073-30.606-14.568-4.108-1.496-7.09-2.243-10.073 2.243-2.982 4.487-11.568 14.577-14.181 17.559-2.613 2.991-5.226 3.361-9.704 1.117-4.477-2.243-18.908-6.97-36.02-22.226-13.313-11.878-22.304-26.54-24.916-31.027-2.613-4.486-.275-6.91 1.959-9.136 2.011-2.011 4.478-5.234 6.721-7.847 2.244-2.613 2.983-4.486 4.478-7.469 1.496-2.991.748-5.603-.369-7.847-1.118-2.243-10.073-24.289-13.812-33.253-3.636-8.732-7.331-7.546-10.073-7.692-2.613-.13-5.595-.155-8.586-.155-2.991 0-7.839 1.118-11.947 5.604-4.108 4.486-15.677 15.324-15.677 37.361s16.047 43.344 18.29 46.335c2.243 2.991 31.585 48.225 76.51 67.632 10.684 4.615 19.029 7.374 25.535 9.437 10.727 3.412 20.49 2.931 28.208 1.779 8.604-1.289 26.498-10.838 30.228-21.298 3.73-10.46 3.73-19.433 2.613-21.298-1.117-1.865-4.108-2.991-8.586-5.234l.008-.017Z" />
  </svg>
);

const MAP_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250765.00940662218!2d78.91917245508232!3d10.872138483235277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a552e70446f5725%3A0xd549c6363279805!2sBawaa%20Medicals%20Aduthurai!5e0!3m2!1sen!2sin!4v1781741372988!5m2!1sen!2sin";

const contactDetails = [
  {
    label: "Address",
    lines: [
      "260, Railway Road",
      "Aduthurai – 612 101",
    ],
    buttonIcon: Navigation,
    href: "https://maps.app.goo.gl/LQiVEuMejUwDmZfq9",
    embed: MAP_EMBED,
  },
  {
    label: "Phone",
    lines: [
      "0435-2472473",
    ],
    buttonIcon: PhoneCall,
    href: "tel:04352472473",
  },
  {
    label: "Mobile / WhatsApp",
    lines: [
      "94865 72473",
      "93607 78073",
    ],
    buttonIcon: WhatsAppIcon,
    href: "https://wa.me/919486572473",
  },
  {
    label: "Email",
    lines: [
      "bawaaadt@gmail.com",
    ],
    buttonIcon: Mail,
    href: "mailto:bawaaadt@gmail.com",
  },
];

const HelpPage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <div className="flex items-center gap-3 mb-6 mt-2">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h1 className="text-xl font-extrabold text-foreground">Help & Support</h1>
        </div>

        <div className="space-y-4">
          {contactDetails.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm mb-1">{item.label}</p>
                  {item.lines.map((line) => (
                    <p key={line} className="text-sm text-muted-foreground">{line}</p>
                  ))}
                </div>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 hover:bg-primary/20 transition-colors"
                >
                  <item.buttonIcon size={16} className="text-primary" />
                </a>
              </div>
              {"embed" in item && (
                <iframe
                  src={item.embed}
                  width="100%"
                  height="180"
                  style={{ border: 0, borderRadius: "0.75rem", marginTop: "0.75rem" }}
                  allowFullscreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bawaa Medicals location"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default HelpPage;
