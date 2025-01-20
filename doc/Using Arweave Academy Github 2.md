# Using Arweave Academy GitHub

Contributing to open-source projects is a great way to improve your coding skills, collaborate with others, and give back to the community. In this developer online education event, we will also encourage you to participate by submitting Pull Request (PR). Here’s a step-by-step guide.

## 1. Fork the Repository

- Go to the [Arweave-Academy](https://github.com/ArweaveOasis/Arweave-Academy) repository on GitHub which is produced by Arweave Oasis.
- Click the **`Fork`** button at the top right corner to create your copy of the repository.

  ![PR tutorial fork 1](./image/PR%20tutorial_fork_1.png)

  ![PR tutorial fork 2](./image/PR%20tutorial_fork_2.png)

- You can find the repository you have forked in your GitHub account.

  ![PR tutorial fork 3](./image/PR%20tutorial_fork_3.png)

## 2. Clone Your Fork

- Copy the repository URL from your forked repository.

  ![clone tutorial fork1](./image/Clone%20tutorial_fork_1.png)

- Open your terminal and run:

  ``` bash
  git clone <repository-url>
  ## Exmaple:  git clone https://github.com/gerrywang1117/Arweave-Academy.git
  ```

  ![clone tutorial fork2](./image/Clone%20tutorial_fork_2.png)

## 3. Set Upstream Remote

- Navigate to the cloned directory:

  ``` bash
  cd <repository-folder>
  ## Example:  cd Arweave-Academy
  ```

- Verify the remotes:

  ``` bash
  git remote -v
  ```

  ![clone tutorial fork3](./image/Clone%20tutorial_fork_3.png)

- As we can see, the connection has been established. Next, we need to connect to the upstream, which refers to the original project source that was forked initially, in this case, Arweave-Academy.

  ``` bash
  git remote add upstream <original-repository-url>
  ## Example:  git remote add upstream https://github.com/ArweaveOasis/Arweave-Academy.git
  ```

- At this point, if we enter `git remote -v`, we can see that the local repository is now connected to both the remote repository and the upstream.

  ![upsteam tutorial fork1](./image/Upsteam%20tutorial_fork_1.png)

## 4. Update the Latest Code

Why do we do this? Because while you’re developing, others might also be working on the project. It’s likely that the code you forked is no longer up-to-date. In such cases, you need to continuously update your code, ensuring that you update it at least once before pushing. This ensures that code conflicts are minimized.

```bash
 git fetch upstream main
```

## 5. Make Changes

- Edit the code or documentation in your local repository.
- Thoroughly test your changes to ensure they function as intended.
- Stage your changes:

    ```bash
    git add .
    ```

- Commit your changes with a meaningful message:

    ```bash
    git commit -m "Description of changes"
    ```

## 6. Push Changes to Your Fork

- Push your changes to your forked repository. This allows you to push all changes to your forked repository.

    ```bash
    git push origin main
    ```

    ![push tutorial_fork_1.png](./image/push%20tutorial_fork_1.png)

## 7. Open a Pull Request

- Go to the original repository on GitHub. Click the **Pull Requests** tab.

    ![PR tutorial_submission_1.png](./image/PR%20tutorial_submission_1.png)

- Click **New Pull Request**.

    ![PR tutorial_submission_2.png](./image/PR%20tutorial_submission_2.png)

- Click **Create Pull Request.**

    ![PR tutorial_submission_3.png](./image/PR%20tutorial_submission_3.png)

- Write a clear title and description for your PR, explaining what you’ve changed and why. Then submit the Pull Request.

    ![PR tutorial_submission_4.png](./image/PR%20tutorial_submission_4.png)

## 8. Celebrate Your Contribution!

- Wait for maintainers to review your PR and merge to the main repository.

  ![PR tutorial_submission_5.png](./image/PR%20tutorial_submission_5.png)

- Once your PR is merged, congratulations! You’ve successfully joined the event.

## Tips for Successful Contributions

- Be respectful and patient when communicating with maintainers.
- Follow the project’s coding style and guidelines.
- Make small, focused changes rather than large, complex updates.
