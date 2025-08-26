// LeaveRequests Schema (Expanded for Future Requirements)
const leaveRequestSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "userAuth",
            required: true,
        },
        seniorId: {
            type: Schema.Types.ObjectId,
            ref: "userAuth",
            required: true,
        },
        ccUserIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "userAuth",
            },
        ],
        bccUserIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "userAuth",
            },
        ],
        leaveType: {
            type: String,
            enum: [
                "sick",
                "casual",
                "vacation",
                "maternity",
                "paternity",
                "bereavement",
                "unpaid",
                "other",
            ],
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isHalfDay: {
            type: Boolean,
            default: false,
        },
        halfDayPeriod: {
            type: String,
            enum: ["morning", "afternoon", null],
            default: null,
        },
        attachments: [
            {
                fileName: { type: String },
                fileUrl: { type: String }, // URL to file (e.g., stored in S3 or Google Drive)
                fileType: { type: String }, // e.g., "pdf", "jpg"
                uploadedAt: { type: Date, default: Date.now },
            },
        ],
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "cancelled"],
            default: "pending",
        },
        approvalHistory: [
            {
                approverId: { type: Schema.Types.ObjectId, ref: "userAuth" },
                action: {
                    type: String,
                    enum: ["approved", "rejected", "commented"],
                },
                comment: { type: String },
                actionAt: { type: Date, default: Date.now },
            },
        ],
        rejectionReason: {
            type: String,
        },
        emergencyContact: {
            name: { type: String },
            phone: { type: String },
        },
        notifyUsers: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "userAuth" },
                notifyVia: {
                    type: String,
                    enum: ["email", "sms", "none"],
                    default: "email",
                },
            },
        ],
        isEdited: {
            type: Boolean,
            default: false,
        },
        editHistory: [
            {
                editedBy: { type: Schema.Types.ObjectId, ref: "userAuth" },
                editedAt: { type: Date, default: Date.now },
                changes: { type: Schema.Types.Mixed },
            },
        ],
        linkedAttendanceIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Attendance",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
leaveRequestSchema.index({ userId: 1, startDate: 1 });
leaveRequestSchema.index({ seniorId: 1, status: 1 });

export const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);
