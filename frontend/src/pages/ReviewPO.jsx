import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";

function ReviewPO() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [po, setPo] = useState(null);

    const [comments, setComments] =
        useState("");

    useEffect(() => {
        loadPO();
    }, []);

    const loadPO = async () => {

        try {

            const response =
                await api.get(
                    `/purchaseorders/${id}`
                );

            setPo(response.data);

        } catch (error) {

            console.error(error);

        }
    };

    const approvePO = async () => {

        try {

            await api.put(
                `/purchaseorders/${id}/approve`,
                {
                    Comments: comments
                }
            );

            navigate("/pending-approvals");

        } catch (error) {

            console.error(error);

        }
    };

    const rejectPO = async () => {

        try {

            await api.put(
                `/purchaseorders/${id}/reject`,
                {
                    Comments: comments
                }
            );

            navigate("/pending-approvals");

        } catch (error) {

            console.error(error);

        }
    };

    if (!po) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />

            <div className="review-container">

                <h1>
                    Review Purchase Order
                </h1>

                <p>
                    <strong>PO Number:</strong>{" "}
                    {po.PO_Number}
                </p>

                <p>
                    <strong>Vendor:</strong>{" "}
                    {po.VendorName}
                </p>

                <p>
                    <strong>Employee:</strong>{" "}
                    {po.EmployeeName}
                </p>

                <p>
                    <strong>Description:</strong>{" "}
                    {po.PurchaseDescription}
                </p>

                <p>
                    <strong>Reason:</strong>{" "}
                    {po.ReasonForPurchase}
                </p>

                <p>
                    <strong>Estimated Cost:</strong>{" "}
                    $
                    {Number(
                        po.EstimatedCost || 0
                    ).toFixed(2)}
                </p>

                <textarea
                    placeholder="Comments"
                    value={comments}
                    onChange={(e) =>
                        setComments(
                            e.target.value
                        )
                    }
                />

                <div>

                    <button
                        onClick={approvePO}
                    >
                        Approve
                    </button>

                    <button
                        onClick={rejectPO}
                    >
                        Reject
                    </button>

                </div>

            </div>

        </>
    );
}

export default ReviewPO;