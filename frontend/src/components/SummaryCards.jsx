function SummaryCards() {
    const cards = [
        { title: "Total POs", value: 24 },
        { title: "Pending", value: 3 },
        { title: "Approved", value: 18 },
        { title: "Rejected", value: 3 }
    ];

    return (
        <div className="summary-container">
            {cards.map((card) => (
                <div className="summary-card" key={card.title}>
                    <h3>{card.title}</h3>
                    <p>{card.value}</p>
                </div>
            ))}
        </div>
    );
}

export default SummaryCards;