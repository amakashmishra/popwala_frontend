import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, productTypes, styles } from "@/admin/data/mockAdminData";

const steps = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Images" },
  { id: 3, title: "Details" },
  { id: 4, title: "SEO" },
  { id: 5, title: "Publish" },
];

export default function DesignForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    productType: "",
    category: "",
    style: "",
    description: "",
    material: "",
    ceilingHeight: "",
    roomSize: "",
    lightingType: "",
    priceRange: "",
    pricePerSqFt: "",
    metaTitle: "",
    metaDescription: "",
    tags: "",
    featured: false,
    popular: false,
    enabled: true,
  });

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link to="/admin/designs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-display font-semibold">Add New Design</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Step {currentStep} of {steps.length}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2 flex-1 min-w-fit">
            <button
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                currentStep === step.id
                  ? "text-primary"
                  : currentStep > step.id
                    ? "text-primary"
                    : "text-muted-foreground"
              }`}
            >
              <span
                className={`h-6 w-6 rounded-full border flex items-center justify-center text-[10px] ${
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : currentStep > step.id
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "border-border text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? <Check className="h-3 w-3" /> : step.id}
              </span>
              <span className="hidden md:inline">{step.title}</span>
            </button>
            {index < steps.length - 1 ? (
              <div className="flex-1 h-px bg-border min-w-8" />
            ) : null}
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-xl p-5 md:p-6">
        {currentStep === 1 ? (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium">Design Title</Label>
                <Input
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="e.g. Modern Gypsum Wave"
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-medium">Product Type</Label>
                  <Select
                    value={form.productType}
                    onValueChange={(value) => updateForm("productType", value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes
                        .filter((item) => item.status === "active")
                        .map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => updateForm("category", value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((item) => item.status === "active")
                        .map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium">Style</Label>
                  <Select value={form.style} onValueChange={(value) => updateForm("style", value)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {styles
                        .filter((item) => item.status === "active")
                        .map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  className="mt-1.5 min-h-[100px]"
                  placeholder="Describe the design features, materials, and ideal use cases..."
                />
              </div>
            </div>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Design Images</h2>
            <div className="space-y-4">
              {["Main Image", "Gallery Images", "3D Renders", "Video (Optional)"].map((label) => (
                <div key={label}>
                  <Label className="text-xs font-medium">{label}</Label>
                  <div className="mt-1.5 border-2 border-dashed rounded-xl p-8 text-center text-muted-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer">
                    <Upload className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-xs font-medium">Click to upload or drag and drop</p>
                    <p className="text-[10px] mt-1">PNG, JPG, WebP up to 10MB</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Design Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Material Used"
                value={form.material}
                onChange={(value) => updateForm("material", value)}
                placeholder="e.g. Gypsum Board + LED"
              />
              <Field
                label="Ceiling Height"
                value={form.ceilingHeight}
                onChange={(value) => updateForm("ceilingHeight", value)}
                placeholder="e.g. 9 ft"
              />
              <Field
                label="Room Size"
                value={form.roomSize}
                onChange={(value) => updateForm("roomSize", value)}
                placeholder="e.g. 200-400 sqft"
              />
              <Field
                label="Lighting Type"
                value={form.lightingType}
                onChange={(value) => updateForm("lightingType", value)}
                placeholder="e.g. Cove LED + Spotlights"
              />
              <Field
                label="Estimated Price Range"
                value={form.priceRange}
                onChange={(value) => updateForm("priceRange", value)}
                placeholder="e.g. $800 - $1,600"
              />
              <Field
                label="Price per SqFt ($)"
                value={form.pricePerSqFt}
                onChange={(value) => updateForm("pricePerSqFt", value)}
                placeholder="e.g. 4.50"
              />
            </div>
          </div>
        ) : null}

        {currentStep === 4 ? (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium">Meta Title</Label>
                <Input
                  value={form.metaTitle}
                  onChange={(event) => updateForm("metaTitle", event.target.value)}
                  className="mt-1.5"
                  placeholder="Page title for search engines (60 chars)"
                />
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  {form.metaTitle.length}/60
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium">Meta Description</Label>
                <Textarea
                  value={form.metaDescription}
                  onChange={(event) => updateForm("metaDescription", event.target.value)}
                  className="mt-1.5"
                  placeholder="Page description for search results (160 chars)"
                />
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  {form.metaDescription.length}/160
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium">Tags</Label>
                <Input
                  value={form.tags}
                  onChange={(event) => updateForm("tags", event.target.value)}
                  className="mt-1.5"
                  placeholder="Comma-separated: modern, gypsum, LED"
                />
              </div>
            </div>
          </div>
        ) : null}

        {currentStep === 5 ? (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Publish Settings</h2>
            <div className="space-y-4">
              <ToggleRow
                label="Featured Design"
                hint="Show on homepage featured section"
                checked={form.featured}
                onChange={(value) => updateForm("featured", value)}
              />
              <ToggleRow
                label="Popular Design"
                hint="Mark as trending in catalog"
                checked={form.popular}
                onChange={(value) => updateForm("popular", value)}
              />
              <ToggleRow
                label="Enable Design"
                hint="Make visible on the platform"
                checked={form.enabled}
                onChange={(value) => updateForm("enabled", value)}
              />
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between mt-8 pt-5 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Previous
          </Button>
          {currentStep < 5 ? (
            <Button
              size="sm"
              onClick={() => setCurrentStep((step) => Math.min(5, step + 1))}
            >
              Next <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate("/admin/designs")}>
              <Check className="h-3.5 w-3.5" /> Publish Design
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <Label className="text-xs font-medium">{label}</Label>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1.5"
      />
    </div>
  );
}

function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <label className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[hsl(var(--primary))]"
      />
    </label>
  );
}
