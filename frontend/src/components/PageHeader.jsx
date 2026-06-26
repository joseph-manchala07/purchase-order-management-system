function PageHeader({ title, buttonText, onClick }) {
  return (
    <div className="section-header">
      <h1 className="page-title">
        {title}
      </h1>

      {buttonText && (
        <button
          className="primary-btn"
          onClick={onClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default PageHeader;