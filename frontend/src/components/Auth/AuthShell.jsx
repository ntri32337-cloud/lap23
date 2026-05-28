// src/components/Auth/AuthShell.jsx
import { Link } from "react-router-dom";

export default function AuthShell({
  title = "Welcome",
  subtitle = "",
  icon = "bi bi-person-circle",
  children,
  bottomText,
  bottomLinkText,
  bottomLinkTo,
}) {
  return (
    <div className="signin-page">
      {/* Header banner giống Fruitables (tận dụng .page-header trong App.css) */}
      <div className="container-fluid page-header py-5 mb-5">
        <div className="container">
          <h1 className="text-center text-white display-6 mb-2">{title}</h1>
          {subtitle ? (
            <p className="text-center text-white-50 mb-0">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {/* Card form */}
      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div className="card shadow-sm border-0 signin-card">
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="signin-badge">
                    <i className={icon} />
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">{title}</h4>
                    {subtitle ? (
                      <div className="text-muted small">{subtitle}</div>
                    ) : null}
                  </div>
                </div>

                {children}

                {bottomText && bottomLinkText && bottomLinkTo ? (
                  <div className="small text-muted mt-3">
                    {bottomText}{" "}
                    <Link className="fw-bold text-primary" to={bottomLinkTo}>
                      {bottomLinkText}
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>

            {/* nhỏ nhỏ note */}
            <div className="text-center small text-muted mt-3">
              Tip: Nhập đúng thông tin rồi bấm <b>Submit</b> để gọi API.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
