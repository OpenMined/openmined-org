/**
 * redirects.mjs — the site's redirect registry.
 *
 * Wired into `astro.config.mjs` as the `redirects` map. What the build emits
 * depends on the adapter: @astrojs/cloudflare CLAIMS these routes and writes
 * each as a true HTTP 301 line appended onto the Cloudflare `_redirects` file
 * (that file is the merged source; NO meta-refresh pages are generated), while
 * an adapter-less build instead emits a tiny meta-refresh +
 * `<link rel="canonical">` HTML page at each OLD path. A host that reads
 * neither mechanism (AWS Amplify does not read `_redirects`) must mirror this
 * registry as host-level rules — see HOSTING.md → Redirects. Verified against
 * the built output 2026-08-13.
 *
 * This registry is for HUMAN-NAVIGABLE PAGE redirects only. Two other classes
 * live in `public/_redirects` because they can't/shouldn't be expressed here:
 * wildcards/splats (no static page can be generated per unknown path, e.g.
 * `/author/*`) and machine resource endpoints (feeds, sitemaps — consumers
 * follow the 301 but ignore the HTML meta-refresh, so a meta-refresh `.xml` file
 * would be broken for them). See `public/_redirects`.
 *
 * TWO registries, one merged export — keep them separate so intent stays legible:
 *
 *  - `migrationRedirects` — old WordPress/Ghost URLs → new Astro URLs. Added
 *    once, during the content migration, to preserve inbound links + SEO for
 *    paths whose structure CHANGED. A post whose live URL is already
 *    `/blog/<slug>/` needs NO entry (the slug is preserved verbatim); only add
 *    one when the old path differs (moved out of a dated permalink, renamed
 *    slug, retired taxonomy path, etc.).
 *
 *  - `editorialRedirects` — intentional, ongoing redirects added BY CHOICE over
 *    the site's life: a renamed slug, a retired page folded into another, a
 *    vanity/short URL. These accrue after launch.
 *
 * Convention: keys and values are absolute, root-relative, and (for directory
 * URLs) trailing-slashed to match Astro's output — `/old/`, not `/old`.
 */

/** @type {Record<string, string>} */
export const migrationRedirects = {
  // ── Author archives (audited 2026-07-27 against all 122 live terms; re-run
  // `scripts/audit-author-archives.mjs` if the author set changes).
  //
  // Our archive slug is the `people` id, which is name-derived; PublishPress
  // sometimes derived live's slug from an email or a nickname instead. Where the
  // two differ, the indexed live URL 301s to our canonical one. (`osam` and
  // `openmined-community` also exist as stale duplicate `people` records with
  // zero posts — they generate no archive, so redirecting those paths is safe.)
  '/blog/author/bennettopenmined-org/': '/blog/author/bennett-farkas/',
  '/blog/author/elisepi/': '/blog/author/elise-pi/',
  '/blog/author/khoaopenmined-org/': '/blog/author/khoa-nguyen/',
  '/blog/author/openmined-community/': '/blog/author/openmined-team/',
  '/blog/author/osam/': '/blog/author/osam-kyemenu-sarsah/',
  '/blog/author/subha/': '/blog/author/subha-ramkumar/',

  // Live serves these 9 author archives at 200 but with ZERO posts (accounts
  // that never published, plus one test account). We generate archives only for
  // authors credited on a post, so these paths have no destination — fold them
  // into the blog index rather than 404.
  '/blog/author/annie-krall/': '/blog/',
  '/blog/author/dhruv-aggarwal/': '/blog/',
  '/blog/author/ionesio-junior/': '/blog/',
  '/blog/author/kyle-numann/': '/blog/',
  '/blog/author/kylentest/': '/blog/',
  '/blog/author/ronnie-falcon/': '/blog/',
  '/blog/author/sameer-wagh/': '/blog/',
  '/blog/author/shubham-gupta/': '/blog/',
  '/blog/author/tauquir-ahmed/': '/blog/',

  // ── Post-launch recovery (audit 2026-09-24): paths WordPress/Ghost served, or
  // that Search Console/Plausible still see hits on, which 404ed after cutover.
  // Every source verified 404 and every target 200 on production 2026-09-24.
  '/from-andrew-signup/': '/subscribe/from-andrew/',
  '/blog/turn-claude-into-your-expert-assistant-with-python-and-federated-rag/': '/blog/tutorial-turn-any-llm-into-an-expert-assistant-with-federated-rag-part-1/',
  '/blog/tag/confidential-computing/': '/blog/tag/secure-enclaves/',
  '/blog/privacy-preserving-ai-summary-mit-deep-learning-series/': '/blog/privacy-preserving-ai-a-birds-eye-view/',
  '/blog/openmined-featured-contributor-may-2024/': '/blog/openmined-featured-contributor-may-2024-2/',
  '/blog/ai-run-out-of-data/': '/blog/ai-hasnt-run-out-of-data/',
  '/blog/tutorial-build-your-one-rag-in-10-lines-of-python/': '/blog/tutorial-build-your-own-rag-in-10-lines-of-python/',
  '/blog/what-is-secure-multi-paper-computation/': '/blog/what-is-secure-multi-party-computation/',
  '/blog/what-em-homomorphic-encryption/': '/blog/what-is-homomorphic-encryption/',
  '/blog/split-pysyft/': '/blog/split-neural-networks-on-pysyft/',
  '/blog/reddit-beta-program-growing/': '/blog/reddit-for-researchers-beta-program-is-growing/',
  '/pysft/': '/pysyft/',
  '/federated-learning/syft_flwr-landing-page/': '/syft-flwr/',
  '/syft_flwr/': '/syft-flwr/',
  '/for-genomics/': '/for-biomedical-researchers/',
  '/start-your-subnet/': '/launch-subnet/',
  '/secure-enclaves-for-ai-evaluation/': '/blog/secure-enclaves-for-ai-evaluation/',
  '/federated-credit-scoring/': '/blog/federated-credit-scoring/',
  '/classifying-the-challenges-of-privacy-enhancing-technologies-pets-in-iot-data-markets/': '/blog/classifying-the-challenges-of-privacy-enhancing-technologies-pets-in-iot-data-markets/',
  '/a-survey-of-differential-privacy-frameworks/': '/blog/a-survey-of-differential-privacy-frameworks/',
  '/homepage-animated/': '/',
  '/homepage-new-12-2025/': '/',
  '/home-old/': '/',
  '/blog/federated-learning-for-credit-scoring/': '/blog/federated-credit-scoring/',
  '/blog/openmined-europe-first-expert-forum-frontier-ai/': '/blog/peter-ide-kostic-european-commission-expert-forum-frontier-ai/',
  '/blog/ckks-explained-part-2-full-encoding-and-decoding/': '/blog/ckks-explained-part-2-ckks-encoding-and-decoding/',
  '/blog/ckks-explained-part-2-simple-encoding-and-decoding/': '/blog/ckks-explained-part-2-ckks-encoding-and-decoding/',
  '/blog/privacy-preserving-data-science-explained/': '/blog/private-machine-learning-explained/',
  '/introduction-to-federated-learning/': '/blog/what-is-federated-learning/',
  '/careers/data-scientist/': '/careers/',
  '/careers/general-interest/': '/careers/',
  '/careers/open-roles/': '/careers/',
  '/blog/careers/': '/careers/',
  '/blog/privacy-policy/': '/privacy-policy/',
  '/blog/get-involved/': '/get-involved/',
  '/jobs/': '/careers/',
  '/about/': '/foundation/',
  '/team/': '/foundation/',
  '/community/': '/get-involved/',
  '/get-started/': '/get-involved/',
  '/fellowships/': '/get-involved/',
  '/syft/': '/pysyft/',
  '/courses/': 'https://courses.openmined.org/',
  '/blog/author/madhava/': '/blog/author/madhava-jay/',
  '/blog/author/andrew/': '/blog/author/andrew-trask/',
  '/blog/author/emma/': '/blog/author/emma-bluemke/',
  '/blog/author/nasron/': '/blog/author/nasron-cheong/',
  '/blog/author/ayoub/': '/blog/author/ayoub-benaissa/',
  '/blog/author/helenabarmer/': '/blog/author/helena-barmer/',
  '/blog/author/fatemehsadat/': '/blog/author/fatemehsadat-mireshghallah/',
  '/blog/author/openminedcommunity/': '/blog/author/openmined-team/',
  '/blog/author/sam/': '/blog/',
  '/blog/author/peter/': '/blog/',
  '/blog/tag/data-ethics/': '/blog/tag/ai-ethics/',
  '/blog/what-is-secure-multi-party-computation/amp/': '/blog/what-is-secure-multi-party-computation/',
  '/blog/differential-privacy-call-for-devs/amp/': '/blog/differential-privacy-call-for-devs/',
  '/blog/local-sensitivity/amp/': '/blog/local-sensitivity/',
  '/blog/how-synthetic-data-can-leak-your-information/amp/': '/blog/how-synthetic-data-can-leak-your-information/',
  '/blog/tempered-sigmoid-activations/amp/': '/blog/tempered-sigmoid-activations/',
  '/blog/of-legal-tangles-and-synthetic-datasets/amp/': '/blog/of-legal-tangles-and-synthetic-datasets/',
  '/blog/list-of-companies-in-privacy/amp/': '/blog/list-of-companies-in-privacy/',
  '/blog/differentially-private-deep-learning-using-opacus-in-20-lines-of-code/amp/': '/blog/differentially-private-deep-learning-using-opacus-in-20-lines-of-code/',
  '/blog/openmined-featured-contributor-january-2022/amp/': '/blog/openmined-featured-contributor-january-2022/',
  '/blog/encrypted-training-medical-text-syfertext/amp/': '/blog/encrypted-training-medical-text-syfertext/',
  '/blog/inference-privacy-what-is-it-and-why-do-we-care/amp/': '/blog/inference-privacy-what-is-it-and-why-do-we-care/',
  '/blog/running-effective-meetings-online-openmineds-experience/amp/': '/blog/running-effective-meetings-online-openmineds-experience/',
  '/blog/federated-learning-additive-secret-sharing-pysyft/amp/': '/blog/federated-learning-additive-secret-sharing-pysyft/',
  '/blog/education-openmined/amp/': '/blog/education-openmined/',
  '/blog/pets-real-world-use-cases/amp/': '/blog/pets-real-world-use-cases/',
  '/blog/zero-knowledge-proof/amp/': '/blog/zero-knowledge-proof/',
  '/how-synthetic-data-can-leak-your-information/': '/blog/how-synthetic-data-can-leak-your-information/',
  '/how-synthetic-data-can-leak-your-information/amp/': '/blog/how-synthetic-data-can-leak-your-information/',
  '/differential-privacy-call-for-devs/': '/blog/differential-privacy-call-for-devs/',
  '/differential-privacy-call-for-devs/amp/': '/blog/differential-privacy-call-for-devs/',
  '/extracting-private-data-from-a-neural-network/': '/blog/extracting-private-data-from-a-neural-network/',
  '/extracting-private-data-from-a-neural-network/amp/': '/blog/extracting-private-data-from-a-neural-network/',
  '/which-problem-is-openmined-trying-to-solve/': '/blog/which-problem-is-openmined-trying-to-solve/',
  '/which-problem-is-openmined-trying-to-solve/amp/': '/blog/which-problem-is-openmined-trying-to-solve/',
  '/tempered-sigmoid-activations/amp/': '/blog/tempered-sigmoid-activations/',
  '/differentially-private-deep-learning-using-opacus-in-20-lines-of-code/amp/': '/blog/differentially-private-deep-learning-using-opacus-in-20-lines-of-code/',
  '/openmined-featured-contributor-march-2021/amp/': '/blog/openmined-featured-contributor-march-2021/',
  // Bare taxonomy bases: only /blog/<base>/<term>/ archives exist, so the bare
  // base 404s — fold into the blog index.
  '/blog/tag/': '/blog/',
  '/blog/category/': '/blog/',
  '/blog/author/': '/blog/',
  '/blog/location/': '/blog/',
  '/resources-old/': '/',
  // Old PySyft quickstart URL still linked from several posts.
  '/get-started/': '/pysyft/',
};

/** @type {Record<string, string>} */
export const editorialRedirects = {
  // Retired program/FL landing pages — mirrors the 301s live already serves
  // (verified against production 2026-07-21). The programs + FL hubs were folded
  // into the homepage; the weekly meetup into the co-design recruitment page.
  '/programs/': '/',
  '/federated-learning/': '/',
  '/federated-learning/weekly-support-meetup/': '/federated-learning/co-design/',

  // Events index — folded into the homepage (mirrors the 301 live already
  // serves; verified against production 2026-07-22, same pattern as the
  // programs/FL hubs above). The India-summit-2026 child reg pages are handled
  // separately (past-event triage).
  '/events/': '/',

  // Resources CPT sunset (2026-07-22). The archive index already 301s to home
  // on live; the sole surviving entry (a Privacy Tech Talk Series page) is
  // retired with it.
  '/resources/': '/',
  '/resources/privacy-tech-talk-programming-and-verification-frameworks-differential-privacy/': '/',
};

/**
 * Merged map consumed by astro.config. Editorial wins on key collision (a
 * deliberate later redirect can override a migration default).
 */
export const redirects = { ...migrationRedirects, ...editorialRedirects };
