
function ItemMenu({ data }) {
  if (data.children?.length) {
    return (
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" onClick={(e) => e.preventDefault()}>
          {data.title}
        </a>

        <ul className="dropdown-menu border-0 shadow-sm rounded-3">
          {data.children.map((child, idx) => (
            <li key={idx}>
              <a className="dropdown-item" href={child.path}>{child.title}</a>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="nav-item">
      <a className={`nav-link ${data.isActive ? "active" : ""}`} href={data.path}>
        {data.title}
      </a>
    </li>
  );
}

export default function Nav() {
  const menu = [
    { title: "Home", path: "#home", isActive: true },
    { title: "Shop", path: "#shop" },
    { title: "Shop Detail", path: "#shop-detail" },
    {
      title: "Pages",
      children: [
        { title: "Cart", path: "/cart" },
        { title: "Checkout", path: "#checkout" },
        { title: "Testimonial", path: "#testimonial" },
        { title: "404 Page", path: "#404" },
      ],
    },
    { title: "Contact", path: "#footer" },
  ];

  return (
    <ul className="navbar-nav fruit-nav align-items-lg-center">
      {menu.map((item, index) => (
        <ItemMenu key={index} data={item} />
      ))}
    </ul>
  );
}
