// src/components/Admin/Products/Product.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Auth/AuthProvider";
import foodApi from "../../../api/foodApi";
import categoryApi from "../../../api/categoryApi";

export default function Product({ foods, setFoods }) {
  const { hasPermission } = useAuth();
  const canCreate = !!hasPermission("create");
  const canUpdate = !!hasPermission("update");
  const canDelete = !!hasPermission("delete");

  const PLACEHOLDER = "/images/no-image-icon.jpg";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    image: PLACEHOLDER,
    description: "",
    category: "", // store categoryId (ObjectId)
    stock: 0,
    rating: 0,
  });

  const [editProduct, setEditProduct] = useState(null);

  const fetchFoods = async () => {
    const res = await foodApi.getAll();
    setFoods(res.data?.foods || res.data?.data || res.data || []);
  };

  const fetchCategories = async () => {
    const res = await categoryApi.getAll();
    setCategories(res.data?.categories || res.data?.data || res.data || []);
  };

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([fetchFoods(), fetchCategories()]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = (p) => {
    if (!canUpdate) return;
    setEditProduct({
      ...p,
      // normalize category to categoryId
      category: p?.category?._id ?? p?.category ?? "",
      price: Number(p.price ?? 0),
      stock: Number(p.stock ?? 0),
      rating: Number(p.rating ?? 0),
      image: p.image ?? PLACEHOLDER,
    });
  };

  const handleAddProduct = async () => {
    if (!canCreate) return;

    if (!newProduct.name.trim()) return alert("Vui lòng nhập tên sản phẩm");
    if (!newProduct.category) return alert("Vui lòng chọn category");

    try {
      await foodApi.create({
        ...newProduct,
        price: Number(newProduct.price) || 0,
        stock: Number(newProduct.stock) || 0,
        rating: Number(newProduct.rating) || 0,
        image: newProduct.image || PLACEHOLDER,
      });
      await fetchFoods();
      setNewProduct({
        name: "",
        price: 0,
        image: PLACEHOLDER,
        description: "",
        category: "",
        stock: 0,
        rating: 0,
      });
    } catch (e) {
      console.error("Create food error:", e);
      alert("Thêm sản phẩm thất bại (xem console)");
    }
  };

  const handleUpdate = async () => {
    if (!canUpdate || !editProduct?._id) return;

    if (!editProduct.name.trim()) return alert("Tên không được rỗng");
    if (!editProduct.category) return alert("Chọn category");

    try {
      await foodApi.update(editProduct._id, {
        ...editProduct,
        category: editProduct.category, // categoryId
        price: Number(editProduct.price) || 0,
        stock: Number(editProduct.stock) || 0,
        rating: Number(editProduct.rating) || 0,
        image: editProduct.image || PLACEHOLDER,
      });
      await fetchFoods();
      setEditProduct(null);
    } catch (e) {
      console.error("Update food error:", e);
      alert("Cập nhật thất bại (xem console)");
    }
  };

  const handleDelete = async (_id) => {
    if (!canDelete) return;
    if (!window.confirm("Xóa sản phẩm này?")) return;

    try {
      await foodApi.remove(_id);
      setFoods((prev) => (prev ?? []).filter((p) => String(p._id) !== String(_id)));
    } catch (e) {
      console.error("Delete food error:", e);
      alert("Xóa thất bại (xem console)");
    }
  };

  const list = useMemo(() => foods ?? [], [foods]);

  if (loading) return <div className="p-3 text-muted">Loading...</div>;

  return (
    <div className="p-3">
      <h3 className="fw-bold mb-3">Products (MongoDB CRUD)</h3>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: 90 }}>Image</th>
              <th>Name</th>
              <th style={{ width: 140 }}>Price</th>
              <th>Description</th>
              <th style={{ width: 180 }}>Category</th>
              <th style={{ width: 100 }}>Stock</th>
              <th style={{ width: 90 }}>Rating</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((p) => {
              const isEdit = String(editProduct?._id) === String(p._id);

              return (
                <tr key={p._id}>
                  <td className="text-center">
                    <img
                      src={isEdit ? editProduct.image : p.image}
                      alt={p.name}
                      width={56}
                      height={56}
                      style={{ objectFit: "cover", borderRadius: 10 }}
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                    />
                    {isEdit && (
                      <input
                        className="form-control form-control-sm mt-2"
                        placeholder="Image URL"
                        value={editProduct.image}
                        onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                      />
                    )}
                  </td>

                  <td>
                    {isEdit ? (
                      <input
                        className="form-control"
                        value={editProduct.name}
                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                      />
                    ) : (
                      <b>{p.name}</b>
                    )}
                  </td>

                  <td>
                    {isEdit ? (
                      <input
                        type="number"
                        className="form-control"
                        value={editProduct.price}
                        onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                      />
                    ) : (
                      `${Number(p.price ?? 0).toLocaleString()} đ`
                    )}
                  </td>

                  <td>
                    {isEdit ? (
                      <input
                        className="form-control"
                        value={editProduct.description ?? ""}
                        onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                      />
                    ) : (
                      <span className="text-muted">{p.description ?? ""}</span>
                    )}
                  </td>

                  <td>
                    {isEdit ? (
                      <select
                        className="form-select"
                        value={editProduct.category}
                        onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                      >
                        <option value="">Select category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="badge bg-secondary">
                        {p.category?.name ?? "N/A"}
                      </span>
                    )}
                  </td>

                  <td>
                    {isEdit ? (
                      <input
                        type="number"
                        className="form-control"
                        value={editProduct.stock ?? 0}
                        onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                      />
                    ) : (
                      p.stock ?? 0
                    )}
                  </td>

                  <td>
                    {isEdit ? (
                      <input
                        type="number"
                        className="form-control"
                        value={editProduct.rating ?? 0}
                        onChange={(e) => setEditProduct({ ...editProduct, rating: e.target.value })}
                      />
                    ) : (
                      p.rating ?? 0
                    )}
                  </td>

                  <td className="text-center">
                    {isEdit ? (
                      <div className="d-flex gap-2 justify-content-center">
                        {canUpdate && (
                          <button className="btn btn-info btn-sm text-white" onClick={handleUpdate}>
                            Save
                          </button>
                        )}
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditProduct(null)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex gap-2 justify-content-center">
                        {canUpdate && (
                          <button className="btn btn-warning btn-sm text-white" onClick={() => startEdit(p)}>
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Add new row */}
            {canCreate && (
              <tr>
                <td className="text-center">
                  <img
                    src={newProduct.image}
                    alt="new"
                    width={56}
                    height={56}
                    style={{ objectFit: "cover", borderRadius: 10 }}
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                  />
                  <input
                    className="form-control form-control-sm mt-2"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  />
                </td>

                <td>
                  <input
                    className="form-control"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </td>

                <td>
                  <input
                    className="form-control"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </td>

                <td>
                  <select
                    className="form-select"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={newProduct.rating}
                    onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                  />
                </td>

                <td className="text-center">
                  <button className="btn btn-primary btn-sm text-white" onClick={handleAddProduct}>
                    Add
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {!canCreate && (
          <div className="text-muted small">
            Bạn không có quyền create nên không hiển thị dòng thêm mới.
          </div>
        )}
      </div>
    </div>
  );
}