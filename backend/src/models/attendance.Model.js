// Attendance Schema (Expanded for Future Requirements)
const attendanceSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "userAuth",
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: () => new Date().setHours(0, 0, 0, 0), // Normalized date for daily records
        },
        punches: [
            {
                type: {
                    type: String,
                    enum: ["in", "out", "break_start", "break_end", "other"], // Support multiple types for breaks, shifts, etc.
                    required: true,
                },
                time: { type: Date, required: true, default: Date.now },
                latitude: { type: Number },
                longitude: { type: Number },
                address: { type: String }, // Geocoded address for future reverse geocoding
                deviceInfo: { type: String }, // e.g., "mobile", "web", "biometric"
                source: {
                    type: String,
                    enum: ["manual", "auto", "admin_edit"],
                }, // How the punch was recorded
            },
        ],
        totalHours: {
            type: Number, // Calculated total working hours (virtual or computed)
            default: 0,
        },
        overtimeHours: {
            type: Number, // Calculated overtime
            default: 0,
        },
        status: {
            type: String,
            enum: [
                "pending",
                "completed",
                "incomplete",
                "approved",
                "rejected",
                "on_leave",
                "holiday",
            ],
            default: "pending",
        },
        shiftId: {
            type: Schema.Types.ObjectId,
            ref: "Shift", // Future reference to a Shift schema for shift-based attendance
        },
        leaveId: {
            type: Schema.Types.ObjectId,
            ref: "LeaveRequest", // Link to leave if on leave
        },
        notes: {
            type: String, // Reasons for late/early punch, etc.
        },
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: "userAuth", // Approver (e.g., senior)
        },
        approvedAt: {
            type: Date,
        },
        isEdited: {
            type: Boolean,
            default: false, // Flag if record was edited
        },
        editHistory: [
            {
                editedBy: { type: Schema.Types.ObjectId, ref: "userAuth" },
                editedAt: { type: Date, default: Date.now },
                changes: { type: Schema.Types.Mixed }, // Store changes as JSON
            },
        ],
        geofenceStatus: {
            type: String,
            enum: ["inside", "outside", "unknown"], // For location validation
            default: "unknown",
        },
        isRemote: {
            type: Boolean,
            default: false, // Flag for remote work
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ userId: 1, status: 1 });
attendanceSchema.index({ date: 1 });

// Virtual for calculating total hours (example implementation)
attendanceSchema.virtual("calculatedTotalHours").get(function () {
    if (this.punches.length < 2) return 0;
    let total = 0;
    let lastIn = null;
    this.punches.forEach((punch) => {
        if (punch.type === "in" || punch.type === "break_end") {
            lastIn = punch.time;
        } else if (
            (punch.type === "out" || punch.type === "break_start") &&
            lastIn
        ) {
            total += (punch.time - lastIn) / (1000 * 60 * 60); // Hours
            lastIn = null;
        }
    });
    return total;
});

// Ensure virtuals are included in toJSON and toObject
attendanceSchema.set("toObject", { virtuals: true });
attendanceSchema.set("toJSON", { virtuals: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
