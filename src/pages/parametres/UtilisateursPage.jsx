import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  MapPin,
  MoreVertical,
  UserPlus,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import utilisateurService from "../../services/utilisateurService";
import presenceService from "../../services/presenceService";
import PageHeader from "../../components/headers/PageHeader";
import AppFooter from "../../components/layout/AppFooter";
import "/src/styles/custom.css";

const ACCENT = "#56656b";

const ROLES = [
  { value: "SUPERADMIN", label: "Super administrateur" },
  { value: "ADMIN", label: "Administrateur simple" },
  { value: "RESPONSABLE", label: "Responsable de section" },
];

const roleLabel = (role) => ROLES.find((r) => r.value === role)?.label || role;

const initials = (username = "") => {
  const clean = username.replace(/[._-]/g, " ").trim();
  const parts = clean.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
};

// ─── Sélecteur multi-sections (checkbox dropdown) ───────────────────────────
const SectionsPicker = ({
  sections,
  selectedIds,
  onChange,
  compact = false,
}) => {
  const [open, setOpen] = useState(false);

  const toggle = (id) => {
    if (selectedIds.includes(id)) onChange(selectedIds.filter((x) => x !== id));
    else onChange([...selectedIds, id]);
  };

  const label =
    selectedIds.length === 0
      ? "Aucune section"
      : selectedIds.length === 1
        ? sections.find((s) => s.id === selectedIds[0])?.nom_section ||
          "1 section"
        : `${selectedIds.length} sections`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 ${compact ? "h-7 text-xs" : "h-9 text-sm w-full"} px-3 rounded-md border border-gray-300 bg-white text-gray-600 hover:border-gray-400`}
      >
        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="truncate">{label}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-50 w-64 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1">
            {sections.map((s) => {
              const checked = selectedIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.id)}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      checked ? "border-transparent" : "border-gray-300"
                    }`}
                    style={checked ? { backgroundColor: ACCENT } : {}}
                  >
                    {checked && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <span className="text-gray-700">{s.nom_section}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Modale : modifier l'utilisateur (nom + mot de passe) ─────────────────
const EditUserModal = ({ user, onClose, onSaved }) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { username };
      if (password) payload.password = password;
      await utilisateurService.modifierUtilisateur(user.id, payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div className="border-b-2 border-gray-800 p-5">
          <h3 className="text-lg font-bold text-gray-900">
            Modifier l'utilisateur
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 text-xs px-3 py-2 rounded">
              {error}
            </div>
          )}
          <div>
            <label className="block text-gray-700 text-xs mb-1">
              Nom d'utilisateur
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-gray-700 text-xs mb-1">
              Nouveau mot de passe{" "}
              <span className="text-gray-400">
                (laisser vide pour ne pas changer)
              </span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-white text-sm font-medium rounded-md disabled:opacity-50"
              style={{ backgroundColor: ACCENT }}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Modale : confirmer la suppression définitive ─────────────────────────
const ConfirmDeleteModal = ({ user, onClose, onConfirmed }) => {
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await utilisateurService.supprimerUtilisateur(user.id);
      onConfirmed();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Supprimer ce compte ?
        </h3>
        <p className="text-sm text-gray-500 mb-5">
          <span className="font-medium text-gray-700">{user.username}</span>{" "}
          sera supprimé définitivement et son nom pourra être réutilisé pour
          créer un nouveau compte. Cette action est irréversible.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? "Suppression..." : "Supprimer définitivement"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modale : détail d'un utilisateur (lecture seule) ──────────────────────
const UserDetailModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div className="border-b-2 border-gray-800 p-5">
          <h3 className="text-lg font-bold text-gray-900">
            Détail de l'utilisateur
          </h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
              style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}
            >
              {initials(user.username)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {user.username}
              </p>
              <p className="text-xs text-gray-400">
                {user.is_active ? "Compte actif" : "Compte désactivé"}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Rôle</p>
            <span
              className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: ACCENT }}
            >
              {roleLabel(user.role)}
            </span>
          </div>

          {user.role === "RESPONSABLE" && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">
                Sections gérées
              </p>
              {user.sections_noms && user.sections_noms.length > 0 ? (
                <ul className="text-sm text-gray-700 space-y-1">
                  {user.sections_noms.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">Aucune section assignée</p>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editModalUser, setEditModalUser] = useState(null);
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [detailModalUser, setDetailModalUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "ADMIN",
    sections: [],
  });
  const [error, setError] = useState("");

  const chargerDonnees = async () => {
    setLoading(true);
    try {
      const [users, sec] = await Promise.all([
        utilisateurService.getUtilisateurs(),
        presenceService.getToutesSections(),
      ]);
      setUtilisateurs(users);
      setSections(sec.sections || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const handleCreer = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      await utilisateurService.creerUtilisateur(form);
      setForm({ username: "", password: "", role: "ADMIN", sections: [] });
      await chargerDonnees();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la création");
    } finally {
      setCreating(false);
    }
  };

  const handleChangerRole = async (id, role, sectionIds) => {
    try {
      await utilisateurService.modifierUtilisateur(id, {
        role,
        sections: role === "RESPONSABLE" ? sectionIds : [],
      });
      await chargerDonnees();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la modification");
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleChangerSections = async (id, sectionIds) => {
    try {
      await utilisateurService.modifierUtilisateur(id, {
        sections: sectionIds,
      });
      await chargerDonnees();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la modification");
    }
  };

  const utilisateursFiltres = useMemo(() => {
    if (!search.trim()) return utilisateurs;
    const q = search.trim().toLowerCase();
    return utilisateurs.filter((u) => u.username.toLowerCase().includes(q));
  }, [utilisateurs, search]);

  const kpis = useMemo(
    () => [
      { label: "Comptes", value: utilisateurs.length, dotColor: ACCENT },
      {
        label: "Super administrateurs",
        value: utilisateurs.filter((u) => u.role === "SUPERADMIN").length,
        dotColor: ACCENT,
      },
      {
        label: "Responsables de section",
        value: utilisateurs.filter((u) => u.role === "RESPONSABLE").length,
        dotColor: ACCENT,
      },
    ],
    [utilisateurs],
  );

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="animate-pulse text-gray-400 text-sm">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <PageHeader
        title="Utilisateurs"
        subtitle="Créez les comptes et définissez qui voit quoi, section par section."
        kpis={kpis}
        kpiCols={3}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Création */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4" style={{ color: ACCENT }} />
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Créer un utilisateur
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 text-xs px-3 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleCreer} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-xs mb-1">
                Nom d'utilisateur
              </label>
              <input
                placeholder="ex: rh_marie"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs mb-1">Rôle</label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value, sections: [] })
                }
                className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {form.role === "RESPONSABLE" && (
              <div>
                <label className="block text-gray-700 text-xs mb-1">
                  Sections
                </label>
                <SectionsPicker
                  sections={sections}
                  selectedIds={form.sections}
                  onChange={(ids) => setForm({ ...form, sections: ids })}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={creating}
              className="w-full py-2 text-white font-medium text-sm rounded-md transition disabled:opacity-50 shadow-md"
              style={{ backgroundColor: ACCENT }}
            >
              {creating ? "Création..." : "Créer le compte"}
            </button>
          </form>
        </div>

        {/* Liste */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100 rounded-t-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un utilisateur..."
                className="w-full text-sm pl-9 pr-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>

          <div className="rounded-b-xl overflow-visible">
            {utilisateursFiltres.map((u, i) => (
              <div
                key={u.id}
                onDoubleClick={() => setDetailModalUser(u)}
                className={`flex items-center gap-4 px-5 py-3 cursor-pointer select-none ${i !== 0 ? "border-t border-gray-100" : ""} ${i === utilisateursFiltres.length - 1 ? "rounded-b-xl" : ""} hover:bg-gray-50 transition-colors`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}
                >
                  {initials(u.username)}
                </div>

                <div className="min-w-0 flex-1" title={u.username}>
                  <p className="text-sm font-medium text-gray-800">
                    {u.username}
                  </p>
                </div>

                {u.role === "RESPONSABLE" && (
                  <div className="hidden sm:block shrink-0">
                    <SectionsPicker
                      sections={sections}
                      selectedIds={u.sections}
                      onChange={(ids) => handleChangerSections(u.id, ids)}
                      compact
                    />
                  </div>
                )}

                <div className="relative shrink-0">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === u.id ? null : u.id)
                    }
                    className="flex items-center gap-2 h-8 pl-3 pr-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-full hover:border-gray-300 transition"
                  >
                    {roleLabel(u.role)}
                    <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {openMenuId === u.id && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 top-9 z-50 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                          Rôle
                        </p>
                        {ROLES.map((r) => (
                          <button
                            key={r.value}
                            onClick={() =>
                              handleChangerRole(u.id, r.value, u.sections)
                            }
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                              u.role === r.value
                                ? "font-semibold text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}

                        <div className="my-1 border-t border-gray-100" />

                        <button
                          onClick={() => {
                            setEditModalUser(u);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Modifier (nom, mot de passe)
                        </button>

                        <button
                          onClick={() => {
                            setDeleteModalUser(u);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Supprimer le compte
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {utilisateursFiltres.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-gray-400">
                Aucun utilisateur ne correspond à cette recherche.
              </div>
            )}
          </div>
        </div>
      </div>

      <AppFooter />

      {editModalUser && (
        <EditUserModal
          user={editModalUser}
          onClose={() => setEditModalUser(null)}
          onSaved={() => {
            setEditModalUser(null);
            chargerDonnees();
          }}
        />
      )}

      {deleteModalUser && (
        <ConfirmDeleteModal
          user={deleteModalUser}
          onClose={() => setDeleteModalUser(null)}
          onConfirmed={() => {
            setDeleteModalUser(null);
            chargerDonnees();
          }}
        />
      )}

      {detailModalUser && (
        <UserDetailModal
          user={detailModalUser}
          onClose={() => setDetailModalUser(null)}
        />
      )}
    </div>
  );
}
