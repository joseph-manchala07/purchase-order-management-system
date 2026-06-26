import Navbar from "../components/Navbar";

function PODetails() {
    return (
        <>
            <Navbar />

            <div className="page-container">

                <h1>Purchase Order Details</h1>

                <p><strong>PO Number:</strong> PO-1001</p>
                <p><strong>Vendor:</strong> Amazon</p>
                <p><strong>Status:</strong> Submitted</p>
                <p><strong>Amount:</strong> $450</p>

            </div>
        </>
    );
}

export default PODetails;