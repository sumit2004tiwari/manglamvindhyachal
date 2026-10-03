export declare const publicVendorSelect: {
    readonly id: true;
    readonly userId: true;
    readonly bio: true;
    readonly lineageDetails: true;
    readonly languages: true;
    readonly yearsExperience: true;
    readonly specializations: true;
    readonly photoUrl: true;
    readonly videoIntroUrl: true;
    readonly avgRating: true;
    readonly verificationStatus: true;
    readonly user: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
};
