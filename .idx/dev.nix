{ pkgs, ... }: {
  channel = "stable-25.05";
  packages = [
    pkgs.nodejs_22
  ];
  env = {};
  idx = {
    extensions = [
      "google.gemini-cli-vscode-ide-companion"
    ];
    previews = {
      enable = true;
      previews = {
      };
    };
    workspace = {
      onCreate = {
        default.openFiles = [ ".idx/dev.nix" "README.md" ];
      };
      onStart = {
      };
    };
  };
}