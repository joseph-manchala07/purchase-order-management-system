function POTable({ data }) {
    return (
        <table className="po-table">
            <thead>
                <tr>
                    <th>PO Number</th>
                    <th>Vendor</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>
                {data.map((po) => (
                    <tr key={po.id}>
                        <td>{po.poNumber}</td>
                        <td>{po.vendor}</td>
                        <td>${po.amount}</td>
                        <td>{po.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default POTable;