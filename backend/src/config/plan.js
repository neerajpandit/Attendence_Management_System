export const subscriptionPlans = {
    free: {
        name: "Free",
        price: 0,
        duration: "14 days", // Trial period
        features: ["Basic leave tracking", "Attendance logging"],
    },
    basic: {
        name: "Basic",
        price: 10, // $10/month
        duration: "1 month",
        features: [
            "Full leave management",
            "Attendance tracking",
            "Email notifications",
        ],
    },
    premium: {
        name: "Premium",
        price: 25, // $25/month
        duration: "1 month",
        features: [
            "Full leave management",
            "Attendance tracking",
            "Email notifications",
            "Advanced reporting",
            "Priority support",
        ],
    },
};
