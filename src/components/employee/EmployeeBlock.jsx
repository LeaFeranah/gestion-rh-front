import React, { useState, useRef, useEffect } from "react";
import "/src/styles/custom.css";
import {
  ArrowLeft,
  User,
  Briefcase,
  CreditCard,
  Users,
  Camera,
  Plus,
  Trash2,
  X,
  Download,
  Eye,
  Edit2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import HistoriqueSalaire from "./HistoriqueSalaire";
const EmployeeBlock = ({
  employee,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  onEdit,
  editMode,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState("personnel");
  const fileInputRef = useRef(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
  });

  const data = formData || {};

  // Fonctions de gestion des changements
  const handleSectionChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [field]: value,
      },
    }));
  };

  const handlePersonalChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Gestion de la photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Gestion des enfants
  const handleAddChild = () => {
    setFormData((prev) => {
      const currentFamiliale = prev.familiale || {};
      const currentEnfants = currentFamiliale.enfants || [];

      return {
        ...prev,
        familiale: {
          ...currentFamiliale,
          enfants: [
            ...currentEnfants,
            {
              id: null,
              nom_prenoms: "",
              sexe: "",
              date_naissance: "",
              lieu_naissance: "",
            },
          ],
        },
      };
    });
  };

  const handleChildChange = (index, field, value) => {
    setFormData((prev) => {
      const currentFamiliale = prev.familiale || {};
      const currentEnfants = currentFamiliale.enfants || [];

      const newEnfants = currentEnfants.map((enfant, i) => {
        if (i === index) {
          return {
            ...enfant,
            [field]: value,
          };
        }
        return enfant;
      });

      return {
        ...prev,
        familiale: {
          ...currentFamiliale,
          enfants: newEnfants,
        },
      };
    });
  };

  const handleRemoveChild = (index) => {
    setFormData((prev) => {
      const currentFamiliale = prev.familiale || {};
      const currentEnfants = currentFamiliale.enfants || [];

      const newEnfants = currentEnfants.filter((_, i) => i !== index);

      return {
        ...prev,
        familiale: {
          ...currentFamiliale,
          enfants: newEnfants,
        },
      };
    });
  };

  // Fonction pour calculer l'âge à partir de la date de naissance
  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return null;

    const today = new Date();
    const birthDate = new Date(dateNaissance);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Gestion des photos
  const handlePhotoClick = () => {
    if (photoUrl) {
      setShowPhotoModal(true);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (photoUrl) {
      setContextMenu({
        show: true,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const closeContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0 });
  };

  const handleContextAction = (action) => {
    closeContextMenu();

    switch (action) {
      case "view":
        setShowPhotoModal(true);
        break;
      case "change":
        triggerFileInput();
        break;
      case "remove":
        handleRemovePhoto();
        break;
      case "download":
        downloadPhoto();
        break;
      default:
        break;
    }
  };

  const downloadPhoto = () => {
    if (photoUrl) {
      const link = document.createElement("a");
      link.href = photoUrl;
      link.download = `photo-${data.nom_complet || "employe"}
      }.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowPhotoModal(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.show) {
        closeContextMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("scroll", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("scroll", handleClickOutside);
    };
  }, [contextMenu.show]);

  const isAddMode = editMode && !employee;
  const photoUrl =
    data.photo instanceof File ? URL.createObjectURL(data.photo) : data.photo;
  const enfants = data.familiale?.enfants || [];

  // Navigation par étapes pour l'ajout
  const tabs = [
    {
      id: "personnel",
      label: "Informations Personnelles",
      icon: User,
    },
    {
      id: "salaire",
      label: "Informations Salariales",
      icon: Briefcase,
    },
    {
      id: "bancaire",
      label: "Informations Bancaires",
      icon: CreditCard,
    },
    {
      id: "familiale",
      label: "Informations Familiales",
      icon: Users,
    },
  ];

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleNext = () => {
    if (!isLastTab) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (!isFirstTab) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  // Fonction pour rendre le contenu de l'onglet actif
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "personnel":
        return (
          <div className="bg-gray-200 p-6 rounded-md border border-gray-200">
            {isAddMode && (
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                <User className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations Personnelles
                </h3>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Colonne 1 */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    N° Matricule *
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.numero_matricule || ""}
                      onChange={(e) =>
                        handlePersonalChange("numero_matricule", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      required
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.numero_matricule || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Nom et Prénoms*
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.nom_complet || ""}
                      onChange={(e) =>
                        handlePersonalChange("nom_complet", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      required
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.nom_complet || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Sexe
                  </label>
                  {editMode ? (
                    <select
                      value={data.sexe || ""}
                      onChange={(e) =>
                        handlePersonalChange("sexe", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    >
                      <option value="">-- Sélectionnez --</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.sexe || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Appellation
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.appellation || ""}
                      onChange={(e) =>
                        handlePersonalChange("appellation", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.appellation || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Date de naissance
                  </label>
                  {editMode ? (
                    <input
                      type="date"
                      value={data.date_naissance || ""}
                      onChange={(e) =>
                        handlePersonalChange("date_naissance", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.date_naissance || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Lieu de naissance
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.lieu_naissance || ""}
                      onChange={(e) =>
                        handlePersonalChange("lieu_naissance", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.lieu_naissance || "-"}
                    </span>
                  )}
                </div>
                {/* <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Âge
                  </label>
                  <span className="text-sm text-gray-900 py-2">
                    {data.age || "Non spécifié"}
                  </span>
                </div> */}
                {/* CHAMP ÂGE - Maintenant en mode saisie */}
                {/* CHAMP ÂGE - Calculé automatiquement et affiché dans le champ */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Âge
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={calculateAge(data.date_naissance) || ""}
                      readOnly
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500 bg-gray-100"
                      placeholder="Calculé automatiquement"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {calculateAge(data.date_naissance) || "Non spécifié"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Père
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.pere || ""}
                      onChange={(e) =>
                        handlePersonalChange("pere", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.pere || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Mère
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.mere || ""}
                      onChange={(e) =>
                        handlePersonalChange("mere", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.mere || "-"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  {editMode ? (
                    <textarea
                      value={data.adresse || ""}
                      onChange={(e) =>
                        handlePersonalChange("adresse", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      rows={3}
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2 whitespace-pre-line">
                      {data.adresse || "-"}
                    </span>
                  )}
                </div>
              </div>

              {/* Colonne 2 */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    CIN
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.CIN || ""}
                      onChange={(e) =>
                        handlePersonalChange("CIN", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.CIN || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Date CIN
                  </label>
                  {editMode ? (
                    <input
                      type="date"
                      value={data.date_CIN || ""}
                      onChange={(e) =>
                        handlePersonalChange("date_CIN", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.date_CIN || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Lieu CIN
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.lieu_CIN || ""}
                      onChange={(e) =>
                        handlePersonalChange("lieu_CIN", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.lieu_CIN || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    N° CNAPS
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.numero_cnaps || ""}
                      onChange={(e) =>
                        handlePersonalChange("numero_cnaps", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.numero_cnaps || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Fonction
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.fonction || ""}
                      onChange={(e) =>
                        handlePersonalChange("fonction", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.fonction || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  {editMode ? (
                    <div className="relative">
                      <select
                        value={data.section || ""}
                        onChange={(e) =>
                          handlePersonalChange("section", e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 w-full appearance-none bg-white"
                      >
                        <option value="">-- Sélectionnez une section --</option>
                        <option value="ADMINISTRATION">ADMINISTRATION</option>
                        <option value="BRODERIE MACHINE">
                          BRODERIE MACHINE
                        </option>
                        <option value="BRODERIE MAIN AK17">
                          BRODERIE MAIN AK17
                        </option>
                        <option value="BRODERIE MAIN DEV">
                          BRODERIE MAIN DEV
                        </option>
                        <option value="BUREAU DE METHODE">
                          BUREAU DE METHODE
                        </option>
                        <option value="CONTROLE QUALITE AS">
                          CONTROLE QUALITE AS
                        </option>
                        <option value="CHAINE 1">CHAINE 1</option>
                        <option value="CHAINE 2">CHAINE 2</option>
                        <option value="CHAINE 3">CHAINE 3</option>
                        <option value="CHAINE 4">CHAINE 4</option>
                        <option value="CHAINE 5">CHAINE 5</option>
                        <option value="CHAINE 6">CHAINE 6</option>
                        <option value="CHAINE 7">CHAINE 7</option>
                        <option value="CHAINE 8">CHAINE 8</option>
                        <option value="CHAINE 9">CHAINE 9</option>
                        <option value="CHAINE 10">CHAINE 10</option>
                        <option value="CHAINE 11">CHAINE 11</option>
                        <option value="CHAINE 12">CHAINE 12</option>
                        <option value="CHAINE CUIR">CHAINE CUIR</option>
                        <option value="COLLECTION">COLLECTION</option>
                        <option value="COUPE">COUPE</option>
                        <option value="COUPE COLLECTION">
                          COUPE COLLECTION
                        </option>
                        <option value="FINITION D">FINITION D</option>
                        <option value="FINITION M">FINITION M</option>
                        <option value="FINITION P">FINITION P</option>
                        <option value="FINITION Q">FINITION Q</option>
                        <option value="FINITION R">FINITION R</option>
                        <option value="LECTRA">LECTRA</option>
                        <option value="LEMARIE HVA">LEMARIE HVA</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                        <option value="MAISON">MAISON</option>
                        <option value="PACKING/EXPEDITION">
                          PACKING/EXPEDITION
                        </option>
                        <option value="PLISSE">PLISSE</option>
                        <option value="POLE QUALITE 1">POLE QUALITE 1</option>
                        <option value="POLE QUALITE 2">POLE QUALITE 2</option>
                        <option value="RAPHIA 1">RAPHIA 1</option>
                        <option value="RAPHIA 2">RAPHIA 2</option>
                        <option value="RAPHIA 3">RAPHIA 3</option>
                        <option value="RAPHIA 4">RAPHIA 4</option>
                        <option value="RAPHIA 5">RAPHIA 5</option>
                        <option value="RAPHIA 6">RAPHIA 6</option>
                        <option value="RESPONSABLE 0">RESPONSABLE 0</option>
                        <option value="RESPONSABLE 1">RESPONSABLE 1</option>
                        <option value="RESPONSABLE 2">RESPONSABLE 2</option>
                        <option value="RESPONSABLE 3">RESPONSABLE 3</option>
                        <option value="RESPONSABLE RAPHIA">
                          RESPONSABLE RAPHIA
                        </option>
                        <option value="SECURITE">SECURITE</option>
                      </select>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.section || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Ancien N° Journalière
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.ancien_numero_journaliere || ""}
                      onChange={(e) =>
                        handlePersonalChange(
                          "ancien_numero_journaliere",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.ancien_numero_journaliere || "-"}
                    </span>
                  )}
                </div>
                {/* <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Statut retraite
                  </label>
                  <span className="text-sm text-gray-900 py-2">
                    {data.retraite || "Non spécifié"}
                  </span>
                </div> */}
                {/* CHAMP STATUT RETRAITE - Oui ou Non basé sur l'âge */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Statut retraite
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={
                        calculateAge(data.date_naissance) >= 65 ? "Oui" : "Non"
                      }
                      readOnly
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500 bg-gray-100"
                    />
                  ) : (
                    <span
                      className={`text-sm py-2 ${
                        calculateAge(data.date_naissance) >= 65
                          ? "text-red-600 font-semibold"
                          : "text-gray-900"
                      }`}
                    >
                      {calculateAge(data.date_naissance) >= 65 ? "Oui" : "Non"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.telephone || ""}
                      onChange={(e) =>
                        handlePersonalChange("telephone", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.telephone || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      value={data.email || ""}
                      onChange={(e) =>
                        handlePersonalChange("email", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.email || "-"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      // case "salaire":
      //   return (
      //     <div className="bg-gray-200 p-6 rounded-md border border-gray-200">
      //       {isAddMode && (
      //         <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
      //           <Briefcase className="w-5 h-5 text-gray-600" />
      //           <h3 className="text-lg font-semibold text-gray-900">
      //             Informations Salariales
      //           </h3>
      //         </div>
      //       )}

      //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      //         {/* Colonne 1 */}
      //         <div className="space-y-4">
      //           <div className="flex flex-col">
      //             <label className="text-sm font-medium text-gray-700 mb-1">
      //               Date d'embauche
      //             </label>
      //             {editMode ? (
      //               <input
      //                 type="date"
      //                 value={data.salaire_personnel?.date_embauche || ""}
      //                 onChange={(e) =>
      //                   handleSectionChange(
      //                     "salaire_personnel",
      //                     "date_embauche",
      //                     e.target.value
      //                   )
      //                 }
      //                 className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
      //               />
      //             ) : (
      //               <span className="text-sm text-gray-900 py-2">
      //                 {data.salaire_personnel?.date_embauche || "-"}
      //               </span>
      //             )}
      //           </div>

      //           <div className="flex flex-col">
      //             <label className="text-sm font-medium text-gray-700 mb-1">
      //               Responsable section
      //             </label>
      //             {editMode ? (
      //               <input
      //                 type="text"
      //                 value={data.salaire_personnel?.responsable_section || ""}
      //                 onChange={(e) =>
      //                   handleSectionChange(
      //                     "salaire_personnel",
      //                     "responsable_section",
      //                     e.target.value
      //                   )
      //                 }
      //                 className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
      //               />
      //             ) : (
      //               <span className="text-sm text-gray-900 py-2">
      //                 {data.salaire_personnel?.responsable_section || "-"}
      //               </span>
      //             )}
      //           </div>

      //           <div className="flex flex-col">
      //             <label className="text-sm font-medium text-gray-700 mb-1">
      //               Catégorie
      //             </label>
      //             {editMode ? (
      //               <select
      //                 value={data.salaire_personnel?.categorie || ""}
      //                 onChange={(e) =>
      //                   handleSectionChange(
      //                     "salaire_personnel",
      //                     "categorie",
      //                     e.target.value
      //                   )
      //                 }
      //                 className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
      //               >
      //                 <option value="">-- Sélectionnez une catégorie --</option>
      //                 <option value="M1">M1</option>
      //                 <option value="M2">M2</option>
      //                 <option value="0S1">0S1</option>
      //                 <option value="0S2">0S2</option>
      //                 <option value="0S3">0S3</option>
      //                 <option value="0P1A">0P1A</option>
      //                 <option value="0P1B">0P1B</option>
      //                 <option value="0P2A">0P2A</option>
      //                 <option value="0P2B">0P2B</option>
      //                 <option value="0P3">0P3</option>
      //                 <option value="H.C">H.C</option>
      //               </select>
      //             ) : (
      //               <span className="text-sm text-gray-900 py-2">
      //                 {data.salaire_personnel?.categorie || "-"}
      //               </span>
      //             )}
      //           </div>

      //           <div className="flex flex-col">
      //             <label className="text-sm font-medium text-gray-700 mb-1">
      //               Indice
      //             </label>
      //             {editMode ? (
      //               <input
      //                 type="text"
      //                 value={data.salaire_personnel?.indice || ""}
      //                 onChange={(e) =>
      //                   handleSectionChange(
      //                     "salaire_personnel",
      //                     "indice",
      //                     e.target.value
      //                   )
      //                 }
      //                 className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
      //               />
      //             ) : (
      //               <span className="text-sm text-gray-900 py-2">
      //                 {data.salaire_personnel?.indice || "-"}
      //               </span>
      //             )}
      //           </div>

      //           <div className="flex flex-col">
      //             <label className="text-sm font-medium text-gray-700 mb-1">
      //               Taux horaire (Ar)
      //             </label>
      //             {editMode ? (
      //               <input
      //                 type="number"
      //                 step="0.01"
      //                 value={data.salaire_personnel?.taux_horaire || ""}
      //                 onChange={(e) =>
      //                   handleSectionChange(
      //                     "salaire_personnel",
      //                     "taux_horaire",
      //                     e.target.value
      //                   )
      //                 }
      //                 className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
      //               />
      //             ) : (
      //               <span className="text-sm text-gray-900 py-2">
      //                 {data.salaire_personnel?.taux_horaire
      //                   ? `${Number(
      //                       data.salaire_personnel.taux_horaire
      //                     ).toLocaleString("fr-FR")} Ar`
      //                   : "-"}
      //               </span>
      //             )}
      //           </div>

      //           <div className="flex flex-col">
      //             <label className="text-sm font-medium text-gray-700 mb-1">
      //               Salaire de base (Ar)
      //             </label>
      //             {editMode ? (
      //               <input
      //                 type="number"
      //                 step="0.01"
      //                 value={data.salaire_personnel?.salaire_base || ""}
      //                 onChange={(e) =>
      //                   handleSectionChange(
      //                     "salaire_personnel",
      //                     "salaire_base",
      //                     e.target.value
      //                   )
      //                 }
      //                 className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
      //               />
      //             ) : (
      //               <span className="text-sm text-gray-900 py-2">
      //                 {data.salaire_personnel?.salaire_base
      //                   ? `${Number(
      //                       data.salaire_personnel.salaire_base
      //                     ).toLocaleString("fr-FR")} Ar`
      //                   : "-"}
      //               </span>
      //             )}
      //           </div>
      //         </div>

      //         {/* Colonne 2 */}
      //         <div className="space-y-4">
      //           <div className="flex flex-col">
      //             <label className="text-sm font-medium text-gray-700 mb-1">
      //               Prime ancienneté (Ar)
      //             </label>
      //             {editMode ? (
      //               <input
      //                 type="number"
      //                 step="0.01"
      //                 value={data.salaire_personnel?.prime_anciennete || ""}
      //                 onChange={(e) =>
      //                   handleSectionChange(
      //                     "salaire_personnel",
      //                     "prime_anciennete",
      //                     e.target.value
      //                   )
      //                 }
      //                 className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
      //               />
      //             ) : (
      //               <span className="text-sm text-gray-900 py-2">
      //                 {data.salaire_personnel?.prime_anciennete
      //                   ? `${Number(
      //                       data.salaire_personnel.prime_anciennete
      //                     ).toLocaleString("fr-FR")} Ar`
      //                   : "-"}
      //               </span>
      //             )}
      //           </div>

      //           <div className="flex flex-col">
      //             <label className="text-sm font-medium text-gray-700 mb-1">
      //               Indemnité déplacement (Ar)
      //             </label>
      //             {editMode ? (
      //               <input
      //                 type="number"
      //                 step="0.01"
      //                 value={
      //                   data.salaire_personnel?.indemnite_deplacement || ""
      //                 }
      //                 onChange={(e) =>
      //                   handleSectionChange(
      //                     "salaire_personnel",
      //                     "indemnite_deplacement",
      //                     e.target.value
      //                   )
      //                 }
      //                 className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
      //               />
      //             ) : (
      //               <span className="text-sm text-gray-900 py-2">
      //                 {data.salaire_personnel?.indemnite_deplacement
      //                   ? `${Number(
      //                       data.salaire_personnel.indemnite_deplacement
      //                     ).toLocaleString("fr-FR")} Ar`
      //                   : "-"}
      //               </span>
      //             )}
      //           </div>

      //           <div className="flex flex-col">
      //             <label className="text-sm font-medium text-gray-700 mb-1">
      //               Autre indemnité (Ar)
      //             </label>
      //             {editMode ? (
      //               <input
      //                 type="number"
      //                 step="0.01"
      //                 value={data.salaire_personnel?.autre_indemnite || ""}
      //                 onChange={(e) =>
      //                   handleSectionChange(
      //                     "salaire_personnel",
      //                     "autre_indemnite",
      //                     e.target.value
      //                   )
      //                 }
      //                 className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
      //               />
      //             ) : (
      //               <span className="text-sm text-gray-900 py-2">
      //                 {data.salaire_personnel?.autre_indemnite
      //                   ? `${Number(
      //                       data.salaire_personnel.autre_indemnite
      //                     ).toLocaleString("fr-FR")} Ar`
      //                   : "-"}
      //               </span>
      //             )}
      //           </div>

      //           <div className="flex flex-col">
      //             <label className="text-sm font-medium text-gray-700 mb-1">
      //               Dernier augmentation indice
      //             </label>
      //             {editMode ? (
      //               <input
      //                 type="text"
      //                 value={data.salaire_personnel?.dernier_aug_indice || ""}
      //                 onChange={(e) =>
      //                   handleSectionChange(
      //                     "salaire_personnel",
      //                     "dernier_aug_indice",
      //                     e.target.value
      //                   )
      //                 }
      //                 className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
      //               />
      //             ) : (
      //               <span className="text-sm text-gray-900 py-2">
      //                 {data.salaire_personnel?.dernier_aug_indice || "-"}
      //               </span>
      //             )}
      //           </div>

      //           <div className="flex flex-col">
      //             <label className="text-sm font-medium text-gray-700 mb-1">
      //               Salaire total (Ar)
      //             </label>
      //             {editMode ? (
      //               <input
      //                 type="number"
      //                 step="0.01"
      //                 value={data.salaire_personnel?.salaire_total || ""}
      //                 onChange={(e) =>
      //                   handleSectionChange(
      //                     "salaire_personnel",
      //                     "salaire_total",
      //                     e.target.value
      //                   )
      //                 }
      //                 className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
      //               />
      //             ) : (
      //               <span className="text-sm text-gray-900 py-2">
      //                 {data.salaire_personnel?.salaire_total
      //                   ? `${Number(
      //                       data.salaire_personnel.salaire_total
      //                     ).toLocaleString("fr-FR")} Ar`
      //                   : "-"}
      //               </span>
      //             )}
      //           </div>
      //         </div>
      //       </div>
      //       <div>
      //               {/* 🔹 NOUVEAU : Historique en bas, seulement en mode visualisation */}
      //         {!editMode && employee && data.salaire_personnel?.id && (
      //           <HistoriqueSalaire
      //             employeId={employee.id}
      //             salaireId={data.salaire_personnel.id}
      //           />
      //         )}
      //       </div>

      //     </div>
      //   );

      case "salaire":
        return (
          <div className="bg-gray-200 rounded-md border border-gray-200">
            {isAddMode && (
              <div className="flex items-center gap-2 p-6 pb-4 border-b border-gray-200">
                <Briefcase className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations Salariales
                </h3>
              </div>
            )}

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Colonne 1 */}
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Date d'embauche
                    </label>
                    {editMode ? (
                      <input
                        type="date"
                        value={data.salaire_personnel?.date_embauche || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "salaire_personnel",
                            "date_embauche",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.salaire_personnel?.date_embauche || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Responsable section
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={
                          data.salaire_personnel?.responsable_section || ""
                        }
                        onChange={(e) =>
                          handleSectionChange(
                            "salaire_personnel",
                            "responsable_section",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.salaire_personnel?.responsable_section || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Catégorie
                    </label>
                    {editMode ? (
                      <select
                        value={data.salaire_personnel?.categorie || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "salaire_personnel",
                            "categorie",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      >
                        <option value="">
                          -- Sélectionnez une catégorie --
                        </option>
                        <option value="M1">M1</option>
                        <option value="M2">M2</option>
                        <option value="0S1">0S1</option>
                        <option value="0S2">0S2</option>
                        <option value="0S3">0S3</option>
                        <option value="0P1A">0P1A</option>
                        <option value="0P1B">0P1B</option>
                        <option value="0P2A">0P2A</option>
                        <option value="0P2B">0P2B</option>
                        <option value="0P3">0P3</option>
                        <option value="H.C">H.C</option>
                      </select>
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.salaire_personnel?.categorie || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Indice
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={data.salaire_personnel?.indice || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "salaire_personnel",
                            "indice",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.salaire_personnel?.indice || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Taux horaire (Ar)
                    </label>
                    {editMode ? (
                      <input
                        type="number"
                        step="0.01"
                        value={data.salaire_personnel?.taux_horaire || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "salaire_personnel",
                            "taux_horaire",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.salaire_personnel?.taux_horaire
                          ? `${Number(
                              data.salaire_personnel.taux_horaire
                            ).toLocaleString("fr-FR")} Ar`
                          : "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Salaire de base (Ar)
                    </label>
                    {editMode ? (
                      <input
                        type="number"
                        step="0.01"
                        value={data.salaire_personnel?.salaire_base || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "salaire_personnel",
                            "salaire_base",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.salaire_personnel?.salaire_base
                          ? `${Number(
                              data.salaire_personnel.salaire_base
                            ).toLocaleString("fr-FR")} Ar`
                          : "-"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Colonne 2 */}
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Prime ancienneté (Ar)
                    </label>
                    {editMode ? (
                      <input
                        type="number"
                        step="0.01"
                        value={data.salaire_personnel?.prime_anciennete || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "salaire_personnel",
                            "prime_anciennete",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.salaire_personnel?.prime_anciennete
                          ? `${Number(
                              data.salaire_personnel.prime_anciennete
                            ).toLocaleString("fr-FR")} Ar`
                          : "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Indemnité déplacement (Ar)
                    </label>
                    {editMode ? (
                      <input
                        type="number"
                        step="0.01"
                        value={
                          data.salaire_personnel?.indemnite_deplacement || ""
                        }
                        onChange={(e) =>
                          handleSectionChange(
                            "salaire_personnel",
                            "indemnite_deplacement",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.salaire_personnel?.indemnite_deplacement
                          ? `${Number(
                              data.salaire_personnel.indemnite_deplacement
                            ).toLocaleString("fr-FR")} Ar`
                          : "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Autre indemnité (Ar)
                    </label>
                    {editMode ? (
                      <input
                        type="number"
                        step="0.01"
                        value={data.salaire_personnel?.autre_indemnite || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "salaire_personnel",
                            "autre_indemnite",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.salaire_personnel?.autre_indemnite
                          ? `${Number(
                              data.salaire_personnel.autre_indemnite
                            ).toLocaleString("fr-FR")} Ar`
                          : "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Dernier augmentation indice
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={data.salaire_personnel?.dernier_aug_indice || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "salaire_personnel",
                            "dernier_aug_indice",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.salaire_personnel?.dernier_aug_indice || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Salaire total (Ar)
                    </label>
                    {editMode ? (
                      <input
                        type="number"
                        step="0.01"
                        value={data.salaire_personnel?.salaire_total || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "salaire_personnel",
                            "salaire_total",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.salaire_personnel?.salaire_total
                          ? `${Number(
                              data.salaire_personnel.salaire_total
                            ).toLocaleString("fr-FR")} Ar`
                          : "-"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Historique en bas, seulement en mode visualisation */}
            {!editMode && employee && data.salaire_personnel?.id && (
              <div className="-mx-0">
                <HistoriqueSalaire
                  employeId={employee.id}
                  salaireId={data.salaire_personnel.id}
                />
              </div>
            )}
          </div>
        );

      case "bancaire":
        return (
          <div className="bg-gray-200 p-6 rounded-md border border-gray-200">
            {isAddMode && (
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations Bancaires
                </h3>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Nom de la banque
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.bancaire?.nom_banque || ""}
                      onChange={(e) =>
                        handleSectionChange(
                          "bancaire",
                          "nom_banque",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.bancaire?.nom_banque || "-"}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    RIB
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.bancaire?.cle_rib || ""}
                      onChange={(e) =>
                        handleSectionChange(
                          "bancaire",
                          "cle_rib",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 py-2">
                      {data.bancaire?.cle_rib || "-"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "familiale":
        return (
          <div className="bg-gray-200 p-6 rounded-md border border-gray-200">
            {isAddMode && (
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations Familiales
                </h3>
              </div>
            )}

            <div className="space-y-8">
              {/* Sous-section Époux(se) */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Époux(se)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Nom époux/épouse
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={data.familiale?.epoux_nom || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "familiale",
                            "epoux_nom",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.familiale?.epoux_nom || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Prénoms époux/épouse
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={data.familiale?.epoux_prenoms || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "familiale",
                            "epoux_prenoms",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.familiale?.epoux_prenoms || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Date naissance
                    </label>
                    {editMode ? (
                      <input
                        type="date"
                        value={data.familiale?.epoux_date_naissance || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "familiale",
                            "epoux_date_naissance",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.familiale?.epoux_date_naissance || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Lieu naissance
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={data.familiale?.epoux_lieu_naissance || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "familiale",
                            "epoux_lieu_naissance",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.familiale?.epoux_lieu_naissance || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Société
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={data.familiale?.epoux_societe || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "familiale",
                            "epoux_societe",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.familiale?.epoux_societe || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Fonction
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={data.familiale?.epoux_fonction || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "familiale",
                            "epoux_fonction",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 py-2">
                        {data.familiale?.epoux_fonction || "-"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sous-section Enfants */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-2 border-b border-gray-200">
                  <div>
                    <h4 className="text-md font-semibold text-gray-900">
                      Enfants
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {enfants.length} enfant(s) enregistré(s)
                    </p>
                  </div>
                  {editMode && (
                    <button
                      type="button"
                      onClick={handleAddChild}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-green-600 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter un enfant
                    </button>
                  )}
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  {editMode ? (
                    /* MODE ÉDITION - TABLEAU */
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Informations de l'enfant
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Sexe
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Date de naissance
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Lieu de naissance
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Âge
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {enfants.length > 0 ? (
                            enfants.map((enfant, index) => (
                              <tr
                                key={enfant.id || `new-${index}`}
                                className="hover:bg-gray-50 transition-colors group"
                              >
                                {/* Nom et prénoms */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <input
                                      type="text"
                                      value={enfant.nom_prenoms || ""}
                                      onChange={(e) =>
                                        handleChildChange(
                                          index,
                                          "nom_prenoms",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-300 rounded px-3 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                      placeholder="Saisir le nom et prénoms"
                                      required
                                    />
                                  </div>
                                </td>

                                {/* Sexe */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <select
                                    value={enfant.sexe || ""}
                                    onChange={(e) =>
                                      handleChildChange(
                                        index,
                                        "sexe",
                                        e.target.value
                                      )
                                    }
                                    className="border border-gray-300 rounded px-3 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                  >
                                    <option value="">Non spécifié</option>
                                    <option value="Masculin">Masculin</option>
                                    <option value="Féminin">Féminin</option>
                                  </select>
                                </td>

                                {/* Date naissance */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="date"
                                    value={enfant.date_naissance || ""}
                                    onChange={(e) =>
                                      handleChildChange(
                                        index,
                                        "date_naissance",
                                        e.target.value
                                      )
                                    }
                                    className="border border-gray-300 rounded px-3 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                  />
                                </td>

                                {/* Lieu naissance */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="text"
                                    value={enfant.lieu_naissance || ""}
                                    onChange={(e) =>
                                      handleChildChange(
                                        index,
                                        "lieu_naissance",
                                        e.target.value
                                      )
                                    }
                                    className="border border-gray-300 rounded px-3 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    placeholder="Lieu de naissance"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {enfant.date_naissance ? (
                                      <span className="text-sm">
                                        {calculateAge(enfant.date_naissance)}{" "}
                                        ans
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 text-xs">
                                        -
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveChild(index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Supprimer cet enfant"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="6"
                                className="px-6 py-12 text-center"
                              >
                                <div className="flex flex-col items-center">
                                  <Users className="w-12 h-12 text-gray-300 mb-3" />
                                  <p className="text-gray-500 text-sm mb-2">
                                    Aucun enfant enregistré
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    Cliquez sur "Ajouter un enfant" pour
                                    commencer
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : enfants.length > 0 ? (
                    /* MODE LECTURE - TABLEAU */
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Nom et prénoms
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Sexe
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Date de naissance
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Âge
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Lieu de naissance
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {enfants.map((enfant) => (
                            <tr
                              key={enfant.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-900">
                                    {enfant.nom_prenoms || "-"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    enfant.sexe === "Masculin"
                                      ? "bg-blue-100 text-blue-800"
                                      : enfant.sexe === "Féminin"
                                      ? "bg-pink-100 text-pink-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {enfant.sexe || "Non spécifié"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {enfant.date_naissance
                                  ? new Date(
                                      enfant.date_naissance
                                    ).toLocaleDateString("fr-FR")
                                  : "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {enfant.date_naissance ? (
                                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                                    {calculateAge(enfant.date_naissance)} ans
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-sm">
                                    -
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {enfant.lieu_naissance || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    /* AUCUN ENFANT */
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">
                        Aucun enfant enregistré
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* En-tête avec photo */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <button
              type="button"
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Photo et informations */}
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden ${
                    photoUrl
                      ? "cursor-pointer hover:opacity-90 transition-opacity"
                      : ""
                  }`}
                  onClick={handlePhotoClick}
                  onContextMenu={handleContextMenu}
                >
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Photo de profil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {editMode && (
                  <div className="absolute -bottom-1 -right-1">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition"
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                  {data.nom || ""} {data.prenoms || ""}
                </h2>
                <p className="text-sm text-gray-500">
                  N° {data.numero_matricule || ""}
                </p>
                <p className="text-sm text-gray-600">
                  {data.fonction || "Aucune fonction définie"}
                </p>
              </div>
            </div>
          </div>

          {/* Bouton Modifier - visible seulement en mode visualisation */}
          {!editMode && employee && (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-akj text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Modifier
            </button>
          )}

          {editMode && photoUrl && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded border border-red-200 transition self-start sm:self-center"
            >
              Supprimer photo
            </button>
          )}
        </div>
      </div>

      {/* Navigation par onglets - Mode visualisation */}
      {!isAddMode && (
        <div className="border-b bg-gray-50 overflow-x-auto">
          <div className="grid grid-cols-4 w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-6 py-2 border-b-2 transition whitespace-nowrap text-sm font-medium ${
                    activeTab === tab.id
                      ? "border-gray-600 text-gray-600 bg-white"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isAddMode && (
        <div className="border-b bg-gray-50 overflow-x-auto">
          <div className="flex items-center justify-between px-6 py-1">
            <div className="flex items-center gap-4 flex-1">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isCompleted =
                  tabs.findIndex((t) => t.id === activeTab) > index;

                return (
                  <React.Fragment key={tab.id}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 transition whitespace-nowrap text-sm font-medium flex-1 ${
                        isActive
                          ? "bg-akj text-white"
                          : isCompleted
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                    {index < tabs.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Contenu - Seulement l'onglet actif */}
      <div className="p-6 flex-1">{renderActiveTabContent()}</div>

      {/* Boutons d'action - Tout en bas de la page */}
      {editMode && (
        <div className="border-t bg-gray-200 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between mt-auto">
          <div className="flex gap-3 order-2 sm:order-1">
            {isAddMode && !isFirstTab && (
              <button
                type="button"
                onClick={handlePrevious}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition text-sm font-medium disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition text-sm font-medium disabled:opacity-50"
            >
              Annuler
            </button>
          </div>

          <div className="flex gap-3 order-1 sm:order-2 mb-3 sm:mb-0">
            {isAddMode && !isLastTab && (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onSubmit}
              disabled={loading}
              className="px-6 py-0.5 bg-akj text-white rounded-md transition text-sm font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {employee ? "Modifier l'employé" : "Créer l'employé"}
            </button>
          </div>
        </div>
      )}

      {/* Modales pour la photo */}
      {showPhotoModal && photoUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={handleModalClick}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={photoUrl}
              alt="Photo de profil en grand"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <button
                onClick={downloadPhoto}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </button>
              {editMode && (
                <>
                  <button
                    onClick={() => {
                      setShowPhotoModal(false);
                      triggerFileInput();
                    }}
                    className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      setShowPhotoModal(false);
                      handleRemovePhoto();
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menu contextuel */}
      {contextMenu.show && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-48"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <button
            onClick={() => handleContextAction("view")}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Voir la photo
          </button>

          {editMode && (
            <>
              <button
                onClick={() => handleContextAction("change")}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Modifier la photo
              </button>
              <button
                onClick={() => handleContextAction("remove")}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer la photo
              </button>
            </>
          )}

          <button
            onClick={() => handleContextAction("download")}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Télécharger
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeBlock;
