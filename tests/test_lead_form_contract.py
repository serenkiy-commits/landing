from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")
CLUSTER_JS = (ROOT / "uslugi" / "assets" / "cluster.js").read_text(encoding="utf-8")
SERVICE_PAGES = sorted((ROOT / "uslugi").glob("*/index.html"))


class LeadFormContractTests(unittest.TestCase):
    def test_primary_and_fallback_endpoints_are_configured(self) -> None:
        for source in (INDEX, CLUSTER_JS):
            self.assertIn("https://n8n.82-38-69-40.sslip.io/webhook/lead-form", source)
            self.assertIn("https://n8n.snezhko.store/webhook/lead-form", source)

    def test_success_requires_telegram_confirmation(self) -> None:
        for source in (INDEX, CLUSTER_JS):
            compact = source.replace(" ", "")
            self.assertIn("responseBody?.ok!==true", compact)
            self.assertIn("new AbortController()", source)
            self.assertIn("signal:controller.signal", compact)

    def test_payload_has_id_and_attribution(self) -> None:
        for source in (INDEX, CLUSTER_JS):
            for marker in (
                "lead_id:",
                "utm_source:",
                "utm_medium:",
                "utm_campaign:",
                "referrer:",
                "landing_path:",
            ):
                self.assertIn(marker, source)

    def test_success_screen_is_green_and_explicit(self) -> None:
        css = (ROOT / "uslugi" / "assets" / "cluster.css").read_text(encoding="utf-8")
        self.assertIn("Заявка отправлена", INDEX)
        self.assertIn("Заявка отправлена", CLUSTER_JS)
        self.assertIn(".form-success-screen", css)
        self.assertIn("var(--ok)", css)
        self.assertIn("color:#72d5a5", INDEX)

    def test_all_nine_service_forms_use_shared_submission_code(self) -> None:
        self.assertEqual(9, len(SERVICE_PAGES))
        for page in SERVICE_PAGES:
            source = page.read_text(encoding="utf-8")
            self.assertIn('class="lead-form form-grid"', source, page)
            self.assertIn('<script src="/uslugi/assets/cluster.js" defer></script>', source, page)

    def test_service_hub_routes_to_working_main_form(self) -> None:
        hub = (ROOT / "uslugi" / "index.html").read_text(encoding="utf-8")
        self.assertIn('href="/#calculator"', hub)


if __name__ == "__main__":
    unittest.main()
