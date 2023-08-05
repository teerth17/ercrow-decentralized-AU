export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {
  const [approved, setApproved] = useState(false);
  useEffect(() => {
    const savedApproval = localStorage.getItem(address);
    if (savedApproval) {
      setApproved(JSON.parse(savedApproval));
    }
  }, [address]);

  async function onClick(e) {
    e.preventDefault();
    await handleApprove();
    localStorage.setItem(address, JSON.stringify(true));
    setApproved(true);
  }

  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>
        <div
          className={`button ${approved ? "complete" : ""}`}
          id={address}
          onClick={onClick}
        >
          {approved ? "✓ It's been approved!" : "Approve"}
        </div>
      </ul>
    </div>
  );
}
