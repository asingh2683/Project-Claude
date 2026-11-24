/*
  FIA New England: the one file to edit for facts, links, photos, people, events and news.
  Anything left as "" shows on the site as a dashed "to be added" marker.
  Put photos in the images/ folder and write their path here, e.g. "images/parade.jpg".
*/
window.FIA = {
  contact: {
    email: "",
    phone: "",
    address: "",          // e.g. "PO Box 123, Boston, MA 02101"
    ein: ""               // IRS Employer Identification Number
  },

  social: { Facebook: "", Instagram: "", YouTube: "", LinkedIn: "" },

  links: {
    donate: "",           // payment page (PayPal, Zeffy, Givebutter, Stripe...)
    membership: ""        // online membership form, if you have one
  },

  // Where forms are sent (Formspree, Getform, your own server...).
  // If empty, the contact and volunteer forms open the visitor's email app
  // addressed to contact.email. If that is empty too, nothing is sent and the form says so.
  formEndpoint: "",
  newsletterEndpoint: "",

  // Large photos for the home banner; two or more become a slideshow.
  heroPhotos: [
    // { src: "images/hero-1.jpg", alt: "Dancers at the India Day Parade" },
  ],

  // Photos for cards and pages. Use: "slot name": "images/file.jpg"
  photos: {
    "about": "", "community": "", "health": "", "food": "", "veterans": "", "blood": "",
    "education": "", "environment": "", "parade": "", "diwali": "", "women": "",
    "celebrations": "", "friendship": "", "usa250": "", "india80": "", "exchange": ""
  },

  impact: [
    { label: "Families served", value: "" },
    { label: "Volunteers engaged", value: "" },
    { label: "Health camps conducted", value: "" },
    { label: "Scholarships awarded", value: "" },
    { label: "Food donations distributed", value: "" }
  ],
  impactPeriod: "",       // e.g. "2025 calendar year"

  // Set confirmed:true once the date and venue are settled. Until then the date is shown
  // as the day of the observance. Confirmed events move to "Past events" on their own.
  events: [
    { date: "2027-01-26", title: "Republic Day", text: "Marking the day India's constitution came into effect.", venue: "", register: "", confirmed: false },
    { date: "2027-03-08", title: "International Women's Day", text: "Recognizing the achievements of women in our community.", venue: "", register: "", confirmed: false },
    { date: "2027-03-22", title: "Holi", text: "The festival of colors.", venue: "", register: "", confirmed: false },
    { date: "2027-08-15", title: "India Day Parade", text: "Celebrating India's Independence Day.", venue: "", register: "", confirmed: false },
    { date: "2027-10-29", title: "Diwali", text: "The festival of lights.", venue: "", register: "", confirmed: false }
  ],

  people: {
    leadership: [
      { name: "", role: "President", photo: "" },
      { name: "", role: "Vice President", photo: "" },
      { name: "", role: "Secretary", photo: "" },
      { name: "", role: "Treasurer", photo: "" }
    ],
    trustees: [ { name: "", role: "Trustee", photo: "" }, { name: "", role: "Trustee", photo: "" }, { name: "", role: "Trustee", photo: "" }, { name: "", role: "Trustee", photo: "" } ],
    advisors: [ { name: "", role: "Advisor", photo: "" }, { name: "", role: "Advisor", photo: "" }, { name: "", role: "Advisor", photo: "" }, { name: "", role: "Advisor", photo: "" } ]
  },

  partners: [
    // { name: "Organization", logo: "images/partner.png", url: "https://..." },
  ],

  // Newest first. { date: "2026-08-15", title: "...", source: "...", url: "https://..." }
  news: { press: [], coverage: [], mentions: [], chronicles: [] },
  videos: [],             // { title: "...", url: "https://youtube.com/..." }
  gallery: [],            // { src: "images/...", caption: "..." }

  documents: [
    { title: "IRS determination letter", note: "Confirms 501(c)(3) tax-exempt status", url: "" },
    { title: "Annual reports", note: "Programs and results for each year", url: "" },
    { title: "Financial statements", note: "Including IRS Form 990 filings", url: "" },
    { title: "Bylaws and governance", note: "How the organization is run", url: "" },
    { title: "Donation policies", note: "Gift acceptance, refunds and donor privacy", url: "" }
  ]
};
