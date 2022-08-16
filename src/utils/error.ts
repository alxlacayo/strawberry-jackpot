export const handleErrorMessage = (error: any): string => {
    let message = (error && error.message) || "Something broke wth...";
    if (error.reason) {
        const match = (error.reason as string).match(/'.*'/);
        message = match ? match[0].replaceAll("'", "") : error.reason;
    }
    console.log(error);
    return message;
};
