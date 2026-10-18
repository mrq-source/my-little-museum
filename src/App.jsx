
import { useEffect, useState } from "react";
import "./App.css";

const samples = [
  {
    id: 1,
    title: "That golden evening",
    category: "Memories",
    date: "Summer, 2025",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900",
    story: "The sky turned gold, everything felt quiet, and for a little while, there was nowhere else I needed to be.",
    label: "No. 001"
  },
  {
    id: 2,
    title: "A song on repeat",
    category: "Music",
    date: "A rainy afternoon",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900",
    story: "Some songs feel like places you can return to whenever you need them.",
    label: "No. 002"
  },
  {
    id: 3,
    title: "Somewhere new",
    category: "Places",
    date: "July, 2025",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900",
    story: "A place I had never been before, with a view I wish I could keep forever.",
    label: "No. 003"
  },
  {
    id: 4,
    title: "Little things",
    category: "Objects",
    date: "Everyday things",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900",
    story: "A reminder that ordinary things can become special when there is a story attached to them.",
    label: "No. 004"
  },
  {
    id: 5,
    title: "The days we laughed",
    category: "Memories",
    date: "One random day",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900",
    story: "I don't remember every word we said. I just remember how much we laughed.",
    label: "No. 005"
  },
  {
    id: 6,
    title: "A quiet morning",
    category: "Places",
    date: "Early morning",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900",
    story: "No plans, no rush, just a little time to exist without doing anything important.",
    label: "No. 006"
  }
];

const categories = ["All exhibits", "Memories", "Music", "Places", "Objects"];

const emptyForm = {
  title: "",
  category: "Memories",
  date: "",
  image: "",
  story: ""
};

function readExhibits() {
  try {
    const saved = localStorage.getItem("little-museum-exhibits");
    return saved ? JSON.parse(saved) : samples;
  } catch {
    return samples;
  }
}

function App() {
  const [exhibits, setExhibits] = useState(readExhibits);
  const [activeCategory, setActiveCategory] = useState("All exhibits");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    localStorage.setItem("little-museum-exhibits", JSON.stringify(exhibits));
  }, [exhibits]);

  const filtered = exhibits.filter((item) => {
    const matchesCategory =
      activeCategory === "All exhibits" || item.category === activeCategory;
    const matchesSearch =
      `${item.title} ${item.story} ${item.category}`
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  function addExhibit(event) {
    event.preventDefault();

    const newExhibit = {
      ...form,
      id: Date.now(),
      image: imagePreview || form.image || "",
      label: `No. ${String(exhibits.length + 1).padStart(3, "0")}`
    };

    setExhibits((previous) => [newExhibit, ...previous]);
    setForm(emptyForm);
    setImagePreview("");
    setShowForm(false);
    setActiveCategory("All exhibits");
    setSearch("");
  }

  function deleteExhibit(id) {
    setExhibits((previous) => previous.filter((item) => item.id !== id));
    setSelected(null);
  }

  function closeForm() {
    setShowForm(false);
    setForm(emptyForm);
    setImagePreview("");
  }

  return (
    <main className="museum">
      <header className="topbar">
        <a className="brand" href="#home">little museum<span>®</span></a>
        <a className="top-link" href="#collection">THE COLLECTION ↗</a>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">A MUSEUM OF MY OWN · EST. TODAY</p>
          <h1>Some things<br />deserve to <em>stay.</em></h1>
          <p className="intro">
            A little corner of the internet for the things I don't want to forget.
            Moments, places, songs and everything in between.
          </p>
          <button className="primary-btn" onClick={() => setShowForm(true)}>
            + Add to your museum
          </button>
        </div>
        <div className="hero-art">
          <img
            src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1000"
            alt="Golden sunlight across a quiet landscape"
          />
          <span className="image-note">FIG. 01 — A MOMENT IN TIME</span>
          <span className="hero-stamp">KEEP<br />THIS<br />FOREVER.</span>
        </div>
        <div className="hero-bottom">
          <span>PERSONAL ARCHIVE / VOL. 001</span>
          <span>MADE OF LITTLE THINGS ↓</span>
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE PERMANENT COLLECTION</p>
            <h2>A collection of <em>everything.</em></h2>
          </div>
          <p className="collection-count">
            {filtered.length.toString().padStart(2, "0")} EXHIBITS
          </p>
        </div>

        <div className="toolbar">
          <div className="filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <input
            className="search"
            placeholder="Search the collection..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search exhibits"
          />
        </div>

        {filtered.length > 0 ? (
          <div className="gallery">
            {filtered.map((item, index) => (
              <button
                className="exhibit"
                key={item.id}
                onClick={() => setSelected(item)}
              >
                <div className="exhibit-image">
                  {item.image ? (
                    <img src={item.image} alt={item.title} />
                  ) : (
                    <div className="no-image">A little memory</div>
                  )}
                  <span className="exhibit-number">{item.label}</span>
                  <span className="view-label">VIEW EXHIBIT ↗</span>
                </div>
                <div className="exhibit-info">
                  <div>
                    <p className="category-label">{item.category}</p>
                    <h3>{item.title}</h3>
                  </div>
                  <span className="exhibit-arrow">↗</span>
                </div>
                <p className="exhibit-date">{item.date || "A moment in time"}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>✳</span>
            <h3>Nothing on display just yet.</h3>
            <p>Try another search or add something to your collection.</p>
            <button className="primary-btn" onClick={() => setShowForm(true)}>
              Add an exhibit
            </button>
          </div>
        )}
      </section>

      <footer className="footer">
        <span>THE LITTLE MUSEUM</span>
        <p>Made with care, for things worth remembering.</p>
        <a href="#home">BACK TO THE TOP ↑</a>
      </footer>

      {showForm && (
        <div className="overlay" onClick={closeForm}>
          <section className="dialog" onClick={(event) => event.stopPropagation()}>
            <button className="close-btn" onClick={closeForm} aria-label="Close">×</button>
            <p className="eyebrow">A NEW ADDITION</p>
            <h2>Save a little <em>something.</em></h2>
            <form onSubmit={addExhibit}>
              <label>What should we call it?
                <input
                  required
                  maxLength={70}
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="That one perfect day..."
                />
              </label>
              <div className="form-row">
                <label>Category
                  <select
                    value={form.category}
                    onChange={(event) => setForm({ ...form, category: event.target.value })}
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label>When was it?
                  <input
                    value={form.date}
                    maxLength={50}
                    onChange={(event) => setForm({ ...form, date: event.target.value })}
                    placeholder="Summer, 2026"
                  />
                </label>
              </div>
              <label>Choose a photograph
                <input type="file" accept="image/*" onChange={handleImage} />
              </label>
              {imagePreview && <img className="upload-preview" src={imagePreview} alt="Selected preview" />}
              <label>Tell us its story
                <textarea
                  required
                  maxLength={1000}
                  rows={4}
                  value={form.story}
                  onChange={(event) => setForm({ ...form, story: event.target.value })}
                  placeholder="Why is this worth remembering?"
                />
              </label>
              <button className="primary-btn submit-btn" type="submit">Add to collection ↗</button>
            </form>
          </section>
        </div>
      )}

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <article className="detail-dialog" onClick={(event) => event.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelected(null)} aria-label="Close">×</button>
            {selected.image && <img className="detail-image" src={selected.image} alt={selected.title} />}
            <div className="detail-copy">
              <p className="eyebrow">{selected.label} · {selected.category}</p>
              <h2>{selected.title}</h2>
              <p className="detail-date">{selected.date}</p>
              <p className="detail-story">{selected.story}</p>
              <button className="delete-btn" onClick={() => deleteExhibit(selected.id)}>
                Remove exhibit
              </button>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}

export default App;
