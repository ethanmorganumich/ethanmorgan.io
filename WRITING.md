# Publishing technical notes

The source notes live in `Ethan's Workspace/ethanmorgan.io/`, which is shared with Quartz through a symlink. Write a public Markdown note there, then run:

```bash
./buildWriting.sh
```

This regenerates `/writing` from the notes, applies the dedicated reading theme, and leaves the old Quartz site at `/blog` untouched. Review the generated files with `git status` and `git diff`, then commit and push when ready; Amplify will deploy the update.

Use `/writing` for new short technical posts. `/blog` is the existing blog archive, and `/v2` is the archived version of the old home page.
