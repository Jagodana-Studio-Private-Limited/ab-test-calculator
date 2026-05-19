export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "A/B Test Calculator",
  title: "A/B Test Calculator — Statistical Significance Checker",
  description:
    "Free A/B test statistical significance calculator. Instantly check if your experiment results are statistically significant using z-score and p-value. No login, no signup — 100% browser-based.",
  url: "https://ab-test-calculator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "FlaskConical",
  brandAccentColor: "#8b5cf6",

  // SEO
  keywords: [
    "a/b test calculator",
    "ab test significance",
    "statistical significance calculator",
    "p value calculator",
    "split test calculator",
    "conversion rate optimization",
    "z-score calculator",
    "hypothesis testing tool",
    "cro calculator",
    "ab testing tool free",
  ],
  applicationCategory: "UtilitiesApplication",

  // Theme
  themeColor: "#3b82f6",

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles (for Organization schema sameAs)
  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  // Links
  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/ab-test-calculator",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "A/B Test Calculator is a free, instant statistical significance checker for conversion rate optimization experiments. No signup required.",
    featuresTitle: "Features",
    features: [
      "Z-score & p-value calculation",
      "90%, 95%, and 99% confidence levels",
      "Relative lift & conversion rates",
      "100% browser-based — no data sent",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free A/B Testing Tool",
    titleLine1: "Is Your A/B Test",
    titleGradient: "Statistically Significant?",
    subtitle:
      "Enter your control and variant data to instantly calculate statistical significance, p-value, z-score, and relative lift. Make data-driven decisions with confidence.",
  },

  // Feature Cards (shown on homepage)
  featureCards: [
    {
      icon: "🔬",
      title: "Z-Score & P-Value",
      description:
        "Industry-standard two-proportion z-test gives you exact p-values and z-scores in milliseconds.",
    },
    {
      icon: "🎯",
      title: "Confidence Levels",
      description:
        "Choose 90%, 95%, or 99% confidence thresholds to match your risk tolerance and sample size.",
    },
    {
      icon: "📈",
      title: "Relative Lift",
      description:
        "See the percentage improvement (or decline) of your variant vs control conversion rate at a glance.",
    },
  ],

  // Related Tools (cross-linking to sibling Jagodana tools for internal SEO)
  relatedTools: [
    {
      name: "Meeting Cost Calculator",
      url: "https://meeting-cost-calculator.tools.jagodana.com",
      icon: "💰",
      description: "Calculate the real cost of any meeting in real time.",
    },
    {
      name: "Latency Budget Calculator",
      url: "https://latency-budget-calculator.tools.jagodana.com",
      icon: "⚡",
      description: "Plan your web performance budget across every layer.",
    },
    {
      name: "Performance Budget Calculator",
      url: "https://performance-budget-calculator.tools.jagodana.com",
      icon: "📊",
      description: "Set realistic page weight and speed budgets.",
    },
    {
      name: "API Rate Limit Calculator",
      url: "https://api-rate-limit-calculator.tools.jagodana.com",
      icon: "🔢",
      description: "Calculate API rate limits and throttle windows.",
    },
    {
      name: "Complexity Estimator",
      url: "https://complexity-estimator.tools.jagodana.com",
      icon: "🧮",
      description: "Estimate task complexity and development effort.",
    },
    {
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
  ],

  // HowTo Steps (drives HowTo JSON-LD schema for rich results)
  howToSteps: [
    {
      name: "Enter Control Data",
      text: "Type the number of visitors and conversions for your original (control) version.",
      url: "",
    },
    {
      name: "Enter Variant Data",
      text: "Type the number of visitors and conversions for your test (variant) version.",
      url: "",
    },
    {
      name: "Select Confidence Level",
      text: "Choose 90%, 95%, or 99% confidence level based on your experiment's risk tolerance.",
      url: "",
    },
    {
      name: "Calculate & Interpret",
      text: "Click Calculate to see z-score, p-value, relative lift, and a clear significance verdict.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  // FAQ (drives both the FAQ UI section and FAQPage JSON-LD schema)
  faq: [
    {
      question: "What is statistical significance in A/B testing?",
      answer:
        "Statistical significance tells you whether the difference in conversion rates between your control and variant is likely due to a real effect rather than random chance. A result is typically considered significant when the p-value falls below your chosen threshold (e.g. p < 0.05 for 95% confidence).",
    },
    {
      question: "What confidence level should I use for my A/B test?",
      answer:
        "95% confidence (p < 0.05) is the industry standard for most CRO experiments. Use 99% when the change is high-stakes (pricing, checkout flow). Use 90% for low-risk experiments where you need faster decisions with less traffic.",
    },
    {
      question: "How much traffic do I need for a statistically significant A/B test?",
      answer:
        "It depends on your baseline conversion rate, expected lift, and desired confidence level. As a rule of thumb, aim for at least 100 conversions per variant before drawing conclusions. Small conversion rates and small expected lifts require much larger sample sizes.",
    },
    {
      question: "What is a p-value and how do I interpret it?",
      answer:
        "The p-value is the probability of observing a difference this large (or larger) purely by chance if there were no real effect. A p-value of 0.05 means there's a 5% chance the result is a false positive. Lower p-values indicate stronger evidence against the null hypothesis.",
    },
    {
      question: "What does relative lift mean?",
      answer:
        "Relative lift (or uplift) is the percentage change in conversion rate from control to variant: ((variant CVR − control CVR) / control CVR) × 100. A +10% relative lift means your variant converts 10% better than the original, not that conversions increased by 10 percentage points.",
    },
    {
      question: "Is my data stored or sent anywhere?",
      answer:
        "No. All calculations happen entirely in your browser using JavaScript. No data is ever sent to our servers. Your experiment data stays completely private.",
    },
  ],

  // ====== PAGES (for sitemap + per-page SEO) ======
  pages: {
    "/": {
      title: "A/B Test Calculator — Statistical Significance Checker",
      description:
        "Free A/B test statistical significance calculator. Instantly check if your experiment results are statistically significant using z-score and p-value.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
