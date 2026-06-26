exports.getSummaryReport = async (req, res) => {

    res.json({
        totalSpend: 0,
        monthlySpend: 0,
        openPOs: 0,
        completedPOs: 0
    });
};